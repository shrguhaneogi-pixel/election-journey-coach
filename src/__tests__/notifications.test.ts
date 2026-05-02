import { describe, it, expect } from 'vitest';
import { getReminderMessage } from '../lib/notifications/local';
import { MachineState } from '../types/journey';

const makeState = (currentState: MachineState['currentState'], score: number): MachineState => ({
  currentState,
  context: {
    language: 'en',
    checklistState: {},
    rehearsalAnswers: {},
    readinessScore: score,
  },
});

describe('getReminderMessage', () => {
  it('returns English reminder when at RESULT with score < 100', () => {
    const state = makeState('RESULT', 75);
    expect(getReminderMessage(state, 'en')).toBe(
      "Don't forget to complete your polling day practice!"
    );
  });

  it('returns Spanish reminder when lang is es', () => {
    const state = makeState('RESULT', 50);
    expect(getReminderMessage(state, 'es')).toBe(
      'Recuerda completar tu práctica del día de las elecciones.'
    );
  });

  it('returns Hindi reminder when lang is hi', () => {
    const state = makeState('RESULT', 0);
    expect(getReminderMessage(state, 'hi')).toBe(
      'कृपया अपना मतदान दिवस अभ्यास पूरा करना न भूलें।'
    );
  });

  it('returns null when score is 100 (fully ready)', () => {
    const state = makeState('RESULT', 100);
    expect(getReminderMessage(state, 'en')).toBeNull();
  });

  it('returns null when not in RESULT state, even with low score', () => {
    const state = makeState('CHECKLIST', 0);
    expect(getReminderMessage(state, 'en')).toBeNull();
  });

  it('returns null when not in RESULT state (REHEARSAL)', () => {
    const state = makeState('REHEARSAL', 50);
    expect(getReminderMessage(state, 'en')).toBeNull();
  });

  it('returns null for LANDING state', () => {
    const state = makeState('LANDING', 0);
    expect(getReminderMessage(state, 'en')).toBeNull();
  });

  it('falls back to English for unknown lang at RESULT < 100', () => {
    const state = makeState('RESULT', 50);
    // 'fr' is not a handled language — should fall through to default English
    expect(getReminderMessage(state, 'fr')).toBe(
      "Don't forget to complete your polling day practice!"
    );
  });
});
