import { STORAGE_KEY, SKILLS, seedNotebook, validNotebook, nextLesson, skillOverview, achieved } from './notebook-model.js';

const host = document.querySelector('[data-notebook]');
if (host) {
  const $ = selector => host.querySelector(selector);
  let state = seedNotebook(), selected = 0, role = 'teacher', view = 'week', saveTimer;
  let initialMessage = 'Voorbeeld klaar. Wijzigingen worden automatisch in deze browser bewaard.';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (validNotebook(parsed)) { state = parsed; initialMessage = 'Je eerdere proef staat klaar in deze browser.'; }
      else initialMessage = 'De bewaarde proef kon niet worden gelezen. Het voorbeeld staat weer klaar.';
    }
  } catch { initialMessage = 'Bewaren lukt hier niet. Je kunt wel oefenen zolang de pagina open blijft.'; }
  selected = state.lessons.length - 1;
  const controller = new AbortController(), options = { signal: controller.signal };
  const lesson = () => state.lessons[selected];
  const editable = () => selected === state.lessons.length - 1;
  const uid = () => crypto.randomUUID();
  const announce = message => { $('[data-save]').textContent = message; };
  function persist(message = 'Bewaard in deze browser.') {
    clearTimeout(saveTimer); saveTimer = undefined;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); announce(message); }
    catch { announce('Wijziging toegepast, maar bewaren lukt niet. Houd deze pagina open om verder te oefenen.'); }
  }
  function queueSave() { announce('Wijzigingen bewaren…'); clearTimeout(saveTimer); saveTimer = setTimeout(persist, 350); }
  function el(tag, attributes = {}, text) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function skillSelect(attributes, selectedSkill) {
    const node = el('select', attributes);
    SKILLS.forEach(skill => { const option = el('option', { value: skill }, skill); option.selected = skill === selectedSkill; node.append(option); });
    return node;
  }
  function updateProgress() {
    const goals = lesson().goals, steps = goals.flatMap(goal => goal.steps);
    $('[data-progress]').textContent = `${steps.filter(step => step.achieved).length} van ${steps.length} stappen behaald`;
    goals.forEach(goal => {
      const row = [...$('[data-goals]').children].find(row => row.dataset.goalId === goal.id);
      if (!row) return;
      const done = goal.steps.filter(step => step.achieved).length;
      const status = row.querySelector('[data-status]');
      if (status) status.textContent = `${done}/${goal.steps.length} oefenstappen afgevinkt`;
      const result = row.querySelector('[data-goal-result]');
      if (result) result.textContent = achieved(goal) ? 'Weekdoel behaald' : 'Weekdoel nog niet behaald';
      row.classList.toggle('is-achieved', achieved(goal));
    });
    const open = goals.filter(goal => !achieved(goal)).length;
    $('[data-next-hint]').textContent = open
      ? `${open} openstaande weekdoelen gaan mee, met hun oefenstappen en vinkjes. Deze les en de opmerkingen blijven bewaard.`
      : 'Alle weekdoelen zijn behaald. Begin de volgende les met een leeg weekplan.';
  }
  function notesDetails(goal, index) {
    const details = el('details', { class: 'nb-goal-notes' });
    details.append(el('summary', {}, goal.notes.teacher || goal.notes.student ? 'Opmerkingen bekijken of aanvullen' : 'Opmerking toevoegen'));
    const id = `nb-note-${index}`;
    details.append(el('label', { for: id }, role === 'teacher' ? 'Opmerking van de docent' : 'Mijn opmerking als student'));
    const field = el('textarea', { id, rows: '2', maxlength: '2000', 'data-goal-note': '', placeholder: 'Wat gaat goed? Waar loop je vast?' });
    field.value = goal.notes[role]; field.readOnly = !editable(); details.append(field);
    const other = role === 'teacher' ? 'student' : 'teacher';
    details.append(el('p', { class: 'nb-peer-note' }, `${other === 'student' ? 'Student' : 'Docent'}: ${goal.notes[other] || 'Nog geen opmerking.'}`));
    return details;
  }
  function editorField(parent, id, label, value, attribute, max, multiline = false) {
    parent.append(el('label', { for: id }, label));
    const field = el(multiline ? 'textarea' : 'input', { id, maxlength: String(max), [attribute]: '', ...(multiline ? { rows: '2' } : {}) });
    field.value = value; parent.append(field);
  }
  function stepEditor(step, index, goalIndex) {
    const row = el('div', { class: 'nb-step-editor', 'data-edit-step': step.id });
    editorField(row, `nb-step-text-${goalIndex}-${index}`, `Stap ${index + 1}`, step.text, 'data-step-text', 400, true);
    const label = el('label', {}, 'Vaardigheid'); label.append(skillSelect({ 'data-step-skill': '' }, step.skill)); row.append(label);
    return row;
  }
  function goalEditor(goal, index) {
    const details = el('details', { class: 'nb-goal-edit' }); details.append(el('summary', {}, 'Weekdoel en stappen aanpassen'));
    editorField(details, `nb-piece-${index}`, 'Stuk of oefening', goal.piece, 'data-edit-piece', 100);
    editorField(details, `nb-problem-${index}`, 'Aandachtspunt', goal.problem, 'data-edit-problem', 500, true);
    editorField(details, `nb-target-${index}`, 'Weekdoel', goal.target, 'data-edit-target', 400, true);
    const steps = el('div', { 'data-edit-steps': '' }); goal.steps.forEach((step, i) => steps.append(stepEditor(step, i, index))); details.append(steps);
    details.append(el('button', { type: 'button', class: 'nb-text-button', 'data-append-step': '' }, 'Oefenstap toevoegen'));
    details.append(el('button', { type: 'button', class: 'nb-button', 'data-edit-save': '' }, 'Wijzigingen toepassen'));
    details.append(el('p', { class: 'nb-error', 'data-edit-error': '', role: 'alert', hidden: '' }));
    return details;
  }
  function renderGoal(goal, index) {
    const row = el('article', { class: 'nb-goal', 'data-goal-id': goal.id });
    const heading = el('div', { class: 'nb-piece-heading' });
    heading.append(el('h5', {}, goal.piece), el('span', { class: 'nb-kind' }, goal.kind === 'piece' ? 'Stuk' : 'Oefening'));
    row.append(heading);
    if (view === 'week' && goal.problem) row.append(el('p', { class: 'nb-problem' }, goal.problem));
    const target = el('p', { class: 'nb-target' }); target.append(el('strong', {}, 'Deze week: '), document.createTextNode(goal.target)); row.append(target);
    const resultLabel = el('label', { class: 'nb-result-check' });
    const resultCheck = el('input', { type: 'checkbox', 'data-goal-achieved': '', 'aria-label': `Weekdoel behaald: ${goal.piece}` });
    resultCheck.checked = goal.achieved; resultCheck.disabled = !editable();
    resultLabel.append(resultCheck, el('span', { 'data-goal-result': '' })); row.append(resultLabel);
    let extras = row;
    if (view === 'week') {
      const steps = el('ol', { class: 'nb-steps' });
      goal.steps.forEach((step, i) => {
        const item = el('li', { class: step.achieved ? 'is-achieved' : '', 'data-step-id': step.id });
        const label = el('label', { class: 'nb-step-check' });
        const checkbox = el('input', { type: 'checkbox', 'data-achieved': '', 'aria-label': `${goal.piece}, stap ${i + 1}: ${step.text}` });
        checkbox.checked = step.achieved; checkbox.disabled = !editable();
        const text = el('span'); text.append(el('span', { class: 'nb-step-text' }, `${i + 1}. ${step.text}`), el('small', {}, step.skill));
        label.append(checkbox, text); item.append(label); steps.append(item);
      });
      const box = el('details', { class: 'nb-steps-box', ...(index === 0 ? { open: '' } : {}) });
      box.append(el('summary', { class: 'nb-goal-status', 'data-status': '' }), steps); row.append(box); extras = box;
    } else {
      row.append(el('span', { class: 'nb-goal-status', 'data-status': '' }));
      row.append(el('button', { type: 'button', class: 'nb-text-button', 'data-show-goal': goal.id }, 'Bekijk oefenstappen'));
    }
    extras.append(notesDetails(goal, index));
    if (editable() && role === 'teacher') extras.append(goalEditor(goal, index));
    return row;
  }
  function renderSkills() {
    return skillOverview(lesson()).map(group => {
      const row = el('section', { class: 'nb-skill-group' });
      const heading = el('div', { class: 'nb-section-heading' });
      heading.append(el('h5', {}, group.skill), el('span', {}, `${group.steps.filter(step => step.achieved).length}/${group.steps.length} stappen behaald`)); row.append(heading);
      const list = el('ul');
      [...new Set(group.steps.map(step => step.goalId))].forEach(id => {
        const steps = group.steps.filter(step => step.goalId === id);
        const li = el('li'); li.append(el('button', { type: 'button', class: 'nb-text-button', 'data-show-goal': id }, steps[0].piece));
        li.append(el('p', {}, steps.map(step => step.text).join(' '))); list.append(li);
      }); row.append(list); return row;
    });
  }
  function render() {
    host.querySelectorAll('[data-role-btn]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.roleBtn === role)));
    $('[data-lesson]').closest('label').hidden = state.lessons.length < 2;
    $('[data-lesson]').replaceChildren(...state.lessons.map((item, index) => {
      const option = el('option', { value: String(index) }, `${item.title}${index === state.lessons.length - 1 ? ' · actief' : ''}`); option.selected = index === selected; return option;
    }));
    host.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
    $('[data-history]').hidden = editable();
    $('[data-view-title]').textContent = { week: 'Deze week aan de piano', targets: 'Alle weekdoelen bij elkaar', skills: 'Vaardigheden door het repertoire heen' }[view];
    $('[data-role-hint]').textContent = {
      week: 'Vink oefenstappen af en beoordeel het weekdoel apart. Stappen doorlopen is niet hetzelfde als het doel behalen.',
      targets: 'Een compact overzicht voor het lesgesprek: wat willen we bereiken, en wat staat nog open?',
      skills: 'Dezelfde vaardigheid komt terug in verschillende stukken. Dit toont oefenstappen in deze les, geen beheersingsscore.',
    }[view];
    $('[data-goals]').replaceChildren(...(view === 'skills' ? renderSkills() : lesson().goals.map(renderGoal)));
    $('[data-empty]').hidden = lesson().goals.length > 0;
    $('[data-add-panel]').hidden = !editable() || role !== 'teacher' || view === 'skills';
    $('[data-next-panel]').hidden = !editable() || role !== 'teacher';
    $('[data-notes-label]').textContent = role === 'teacher' ? 'Lesnotities' : 'Mijn terugblik';
    $('[data-notes]').value = lesson().notes[role]; $('[data-notes]').readOnly = !editable();
    const other = role === 'teacher' ? 'student' : 'teacher';
    $('[data-other-label]').textContent = other === 'student' ? 'Terugblik van de student' : 'Lesnotities van de docent';
    $('[data-other-note]').textContent = lesson().notes[other] || 'Hier staat nog geen aantekening.';
    updateProgress();
  }
  host.addEventListener('change', event => {
    const node = event.target;
    if (node.matches('[data-lesson]')) { selected = Number(node.value); render(); return; }
    if (!editable()) return;
    if (node.matches('[data-goal-achieved]')) {
      const goal = lesson().goals.find(goal => goal.id === node.closest('[data-goal-id]').dataset.goalId);
      goal.achieved = node.checked; updateProgress(); persist(goal.achieved ? 'Weekdoel behaald. Bewaard in deze browser.' : 'Weekdoel staat weer open. Bewaard in deze browser.'); return;
    }
    if (!node.matches('[data-achieved]')) return;
    const row = node.closest('[data-goal-id]'), item = node.closest('[data-step-id]');
    const goal = lesson().goals.find(goal => goal.id === row.dataset.goalId);
    const step = goal.steps.find(step => step.id === item.dataset.stepId);
    step.achieved = node.checked; item.classList.toggle('is-achieved', step.achieved);
    updateProgress(); persist(step.achieved ? 'Stap behaald. Bewaard in deze browser.' : 'Stap staat weer open. Bewaard in deze browser.');
  }, options);
  host.addEventListener('input', event => {
    if (!editable()) return;
    const node = event.target;
    if (node.matches('[data-notes]')) { lesson().notes[role] = node.value; queueSave(); }
    if (node.matches('[data-goal-note]')) {
      const goal = lesson().goals.find(goal => goal.id === node.closest('[data-goal-id]').dataset.goalId);
      goal.notes[role] = node.value; queueSave();
    }
  }, options);
  $('[data-add-skill]').replaceChildren(...SKILLS.map(skill => el('option', { value: skill }, skill)));
  $('[data-add-form]').addEventListener('submit', event => {
    event.preventDefault(); if (!editable() || role !== 'teacher') return;
    const form = event.target, data = new FormData(form), error = $('[data-form-error]');
    const piece = data.get('piece').trim(), target = data.get('target').trim();
    const lines = data.get('steps').split('\n').map(line => line.trim()).filter(Boolean);
    if (!piece || !target || !lines.length || lines.length > 30 || lines.some(line => line.length > 400)) {
      error.textContent = 'Vul een stuk, weekdoel en 1–30 stappen in. Gebruik maximaal 400 tekens per stap.'; error.hidden = false; return;
    }
    if (lesson().goals.length >= 100) { error.textContent = 'Deze proef ondersteunt maximaal 100 onderdelen per les.'; error.hidden = false; return; }
    lesson().goals.push({ id: uid(), kind: data.get('kind'), piece, problem: data.get('problem').trim(), target, achieved: false, notes: { teacher: '', student: '' }, steps: lines.map(text => ({ id: uid(), text, skill: data.get('skill'), achieved: false })) });
    form.reset(); error.hidden = true; view = 'week'; render(); persist('Nieuw onderdeel aan het weekplan toegevoegd.');
    $('[data-goals]').lastElementChild.querySelector('input').focus();
  }, options);
  host.addEventListener('click', event => {
    const roleButton = event.target.closest('[data-role-btn]');
    if (roleButton) { role = roleButton.dataset.roleBtn; view = role === 'teacher' ? 'targets' : 'week'; render(); return; }
    const viewButton = event.target.closest('[data-view]');
    if (viewButton) { view = viewButton.dataset.view; render(); return; }
    const show = event.target.closest('[data-show-goal]');
    if (show) {
      const id = show.dataset.showGoal; view = 'week'; render();
      const goal = [...$('[data-goals]').children].find(row => row.dataset.goalId === id);
      goal.setAttribute('tabindex', '-1'); goal.focus(); return;
    }
    if (!editable() || role !== 'teacher') return;
    const append = event.target.closest('[data-append-step]');
    if (append) {
      const row = append.closest('[data-goal-id]'), steps = row.querySelector('[data-edit-steps]');
      if (steps.children.length >= 30) { announce('Maximaal 30 oefenstappen per onderdeel in deze proef.'); return; }
      const index = lesson().goals.findIndex(goal => goal.id === row.dataset.goalId);
      const newStep = stepEditor({ id: uid(), text: '', skill: SKILLS[0] }, steps.children.length, index);
      steps.append(newStep); newStep.querySelector('textarea').focus(); return;
    }
    const edit = event.target.closest('[data-edit-save]'); if (!edit) return;
    const row = edit.closest('[data-goal-id]'), error = row.querySelector('[data-edit-error]');
    const piece = row.querySelector('[data-edit-piece]').value.trim(), target = row.querySelector('[data-edit-target]').value.trim();
    const index = lesson().goals.findIndex(goal => goal.id === row.dataset.goalId), original = lesson().goals[index];
    const steps = [...row.querySelectorAll('[data-edit-step]')].map(stepRow => {
      const previous = original.steps.find(step => step.id === stepRow.dataset.editStep);
      const text = stepRow.querySelector('[data-step-text]').value.trim();
      const skill = stepRow.querySelector('[data-step-skill]').value;
      return { id: stepRow.dataset.editStep, text, skill, achieved: previous?.text === text && previous?.skill === skill ? previous.achieved : false };
    });
    if (!piece || !target || steps.some(step => !step.text)) { error.textContent = 'Vul het stuk, het weekdoel en iedere oefenstap in.'; error.hidden = false; return; }
    Object.assign(original, { piece, target, problem: row.querySelector('[data-edit-problem]').value.trim(), steps, achieved: target === original.target && piece === original.piece ? original.achieved : false });
    render(); persist('Weekdoel en stappen aangepast. Gewijzigde stappen staan weer open.');
    const updated = $('[data-goals]').children[index]; updated.setAttribute('tabindex', '-1'); updated.focus();
  }, options);
  $('[data-next]').addEventListener('click', () => {
    if (!editable() || role !== 'teacher') return;
    if (state.lessons.length >= 100) { announce('De proef bevat 100 lessen. Herstel het voorbeeld om opnieuw te beginnen.'); return; }
    state.lessons.push(nextLesson(lesson(), state.lessons.length + 1, uid)); selected = state.lessons.length - 1;
    render(); persist('Volgende les klaar. Open weekdoelen zijn meegenomen; eerdere notities staan bij de vorige les.'); $('[data-lesson]').focus();
  }, options);
  $('[data-reset]').addEventListener('click', () => { $('[data-reset-confirm]').hidden = false; $('[data-confirm-reset]').focus(); }, options);
  $('[data-cancel-reset]').addEventListener('click', () => { $('[data-reset-confirm]').hidden = true; $('[data-reset]').focus(); }, options);
  $('[data-confirm-reset]').addEventListener('click', () => {
    clearTimeout(saveTimer); state = seedNotebook(); selected = 0; role = 'teacher'; view = 'week';
    $('[data-reset-confirm]').hidden = true; $('[data-add-form]').reset(); $('[data-form-error]').hidden = true;
    render(); persist('Oorspronkelijk voorbeeld hersteld.'); $('[data-role-btn="teacher"]').focus();
  }, options);
  addEventListener('pagehide', () => { if (saveTimer) { clearTimeout(saveTimer); try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} } }, options);
  render(); $('.nb-app').hidden = false; announce(initialMessage);
  if (import.meta.hot) import.meta.hot.dispose(() => { clearTimeout(saveTimer); controller.abort(); });
}
