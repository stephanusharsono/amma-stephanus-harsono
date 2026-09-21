import test from 'node:test';
import assert from 'node:assert/strict';
import { seedNotebook, validNotebook, nextLesson, skillOverview, achieved } from './notebook-model.js';

test('a week starts with two pieces and one exercise; steps do not imply the week goal is achieved', () => {
  const state = seedNotebook(), lesson = state.lessons[0];
  assert.equal(lesson.goals.filter(goal => goal.kind === 'piece').length, 2);
  assert.equal(lesson.goals.filter(goal => goal.kind === 'exercise').length, 1);
  lesson.goals[0].steps.forEach(step => { step.achieved = true; });
  assert.equal(achieved(lesson.goals[0]), false);
  assert.equal(validNotebook(state), true);
});

test('next week carries only open week goals, keeps step progress, and cannot change the archived lesson', () => {
  const current = seedNotebook().lessons[0];
  current.goals[1].achieved = true;
  const before = structuredClone(current);
  let id = 0;
  const next = nextLesson(current, 2, () => `new-${++id}`);
  assert.deepEqual(next.goals.map(goal => goal.piece), ['Billy Joel · Vienna', 'Harmonie aan de Piano']);
  assert.equal(next.goals[0].steps[0].achieved, true);
  assert.notEqual(next.goals[0].id, current.goals[0].id);
  assert.deepEqual(next.goals[0].notes, { teacher: '', student: '' });
  next.goals[0].steps[0].text = 'A new approach';
  next.goals[0].notes.teacher = 'New note';
  assert.deepEqual(current, before);
  assert.equal(validNotebook({ version: 2, lessons: [current, next] }), true);
});

test('all completed goals yield a valid empty plan for the following lesson', () => {
  const current = seedNotebook().lessons[0];
  current.goals.forEach(goal => { goal.achieved = true; });
  const next = nextLesson(current, 2, () => 'next');
  assert.equal(next.goals.length, 0);
  assert.equal(validNotebook({ version: 2, lessons: [current, next] }), true);
});

test('skill view brings together voice-leading steps across all three parts', () => {
  const skill = skillOverview(seedNotebook().lessons[0]).find(group => group.skill === 'Stemvoering');
  assert.equal(new Set(skill.steps.map(step => step.goalId)).size, 3);
  assert.equal(skill.steps.length, 3);
});

test('malformed local data is rejected before rendering', () => {
  for (const value of [null, {}, { version: 2, lessons: [] }, { version: 1, lessons: [] }]) assert.equal(validNotebook(value), false);
  const bad = seedNotebook();
  bad.lessons[0].goals[0].steps[0].achieved = 'true';
  assert.equal(validNotebook(bad), false);
  const duplicate = seedNotebook();
  duplicate.lessons[0].goals[1].steps[0].id = duplicate.lessons[0].goals[0].steps[0].id;
  assert.equal(validNotebook(duplicate), false);
});
