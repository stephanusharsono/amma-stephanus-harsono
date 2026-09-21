export const STORAGE_KEY = 'amma-studentenschrift-demo-v2';
export const SKILLS = ['Audiëren', 'Stemvoering', 'Ritme & groove', 'Structuur & frasering', 'Vingerzetting', 'Gericht oefenen'];
const step = (id, text, skill, achieved = false) => ({ id, text, skill, achieved });
export const seedNotebook = () => ({
  version: 2,
  lessons: [{
    id: 'lesson-1', title: 'Les 1 · voorbeeld',
    notes: { teacher: 'Maak het klein. Kies bij een fout één ding om te verbeteren; de rest mag even wachten.', student: 'De bas apart zingen helpt. Ik wil rustiger blijven wanneer de melodie erbij komt.' },
    goals: [
      {
        id: 'goal-1', kind: 'piece', piece: 'Billy Joel · Vienna', achieved: false,
        problem: 'De groove en de baslijn raken uit beeld zodra alles tegelijk klinkt.',
        target: 'Speel de eerste frase met een herkenbare baslijn en melodie.',
        steps: [
          step('step-1', 'Luister naar de maatsoort en voel waar de eerste tel valt.', 'Ritme & groove', true),
          step('step-2', 'Baken één korte frase af: bijvoorbeeld twee of vier maten.', 'Structuur & frasering'),
          step('step-3', 'Luister alleen naar de bas. Hoor de lijn in je hoofd, zing hem en speel hem daarna.', 'Audiëren'),
          step('step-4', 'Doe hetzelfde met de melodie. Voeg daarna bas en melodie samen.', 'Stemvoering'),
        ], notes: { teacher: 'Eerst luisteren, in je hoofd opslaan, terughoren en dan pas spelen.', student: '' },
      },
      {
        id: 'goal-2', kind: 'piece', piece: 'Schumann · Kinderszenen', achieved: false,
        problem: 'De tussenstemmen maken het lastig om de melodie te blijven horen.',
        target: 'Speel de eerste regel met hoorbare buitenstemmen.',
        steps: [
          step('step-5', 'Speel de bas en de melodie eerst afzonderlijk; hoor beide lijnen vooruit.', 'Stemvoering'),
          step('step-6', 'Speel de begeleiding zonder melodie. Neem de tijd om de vingerzetting te voelen.', 'Vingerzetting'),
          step('step-7', 'Voeg de stemmen per tel samen. Verbeter bij een fout één ding tegelijk.', 'Gericht oefenen'),
        ], notes: { teacher: '', student: '' },
      },
      {
        id: 'goal-3', kind: 'exercise', piece: 'Harmonie aan de Piano', achieved: false,
        problem: 'Bij een andere toonsoort worden de akkoorden losse grepen.',
        target: 'Speel het harmonieschema met een bewust gehoorde sopraan en bas.',
        steps: [
          step('step-8', 'Zing en speel eerst de sopraan, daarna de bas.', 'Audiëren', true),
          step('step-9', 'Combineer de buitenstemmen en voeg daarna de overige akkoordtonen toe.', 'Stemvoering'),
          step('step-10', 'Kies een vaste vingerzetting en oefen de overgang rustig heen en terug.', 'Vingerzetting'),
        ], notes: { teacher: 'Neem de harmonieopdracht mee naar de pianoles.', student: '' },
      },
    ],
  }],
});
const isText = (value, max) => typeof value === 'string' && value.length <= max;
const validNotes = notes => notes && isText(notes.teacher, 2000) && isText(notes.student, 2000);
export const achieved = goal => goal.achieved;
export function validNotebook(value) {
  if (!value || value.version !== 2 || !Array.isArray(value.lessons) || !value.lessons.length || value.lessons.length > 100) return false;
  const ids = new Set();
  return value.lessons.every(lesson => {
    if (!lesson || !isText(lesson.id, 100) || ids.has(lesson.id) || !isText(lesson.title, 100) || !validNotes(lesson.notes) || !Array.isArray(lesson.goals) || lesson.goals.length > 100) return false;
    ids.add(lesson.id);
    const goalIds = new Set(), stepIds = new Set();
    return lesson.goals.every(goal => {
      if (!goal || !isText(goal.id, 100) || goalIds.has(goal.id) || typeof goal.achieved !== 'boolean' || !['piece', 'exercise'].includes(goal.kind) || !isText(goal.piece, 100) || !isText(goal.problem, 500) || !isText(goal.target, 400) || !validNotes(goal.notes) || !Array.isArray(goal.steps) || !goal.steps.length || goal.steps.length > 30) return false;
      goalIds.add(goal.id);
      return goal.steps.every(step => {
        if (!step || !isText(step.id, 100) || stepIds.has(step.id) || !isText(step.text, 400) || !SKILLS.includes(step.skill) || typeof step.achieved !== 'boolean') return false;
        stepIds.add(step.id); return true;
      });
    });
  });
}
export function nextLesson(current, number, makeId) {
  return {
    id: makeId(), title: `Les ${number} · volgende week`, notes: { teacher: '', student: '' },
    goals: current.goals.filter(goal => !achieved(goal)).map(goal => ({
      ...goal, id: makeId(), notes: { teacher: '', student: '' },
      steps: goal.steps.map(step => ({ ...step, id: makeId() })),
    })),
  };
}
export function skillOverview(current) {
  return SKILLS.map(skill => ({ skill, steps: current.goals.flatMap(goal => goal.steps.filter(step => step.skill === skill).map(step => ({ ...step, piece: goal.piece, goalId: goal.id }))) })).filter(group => group.steps.length);
}
