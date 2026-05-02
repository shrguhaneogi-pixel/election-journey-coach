import { describe, it, expect } from 'vitest';
import { appReducer, initialState } from '../lib/journey/state-machine';
import { MachineState } from '../types/journey';

// ---------------------------------------------------------------------------
// Edge-case tests complementing stateMachine.test.ts
// ---------------------------------------------------------------------------

describe('stateMachine — edge cases', () => {
  it('ignores START action if not in LANDING state', () => {
    const state: MachineState = { ...initialState, currentState: 'ONBOARDING' };
    expect(appReducer(state, { type: 'START' })).toEqual(state);
  });

  it('ignores TOGGLE_CHECKLIST_ITEM if not in CHECKLIST state', () => {
    const state: MachineState = { ...initialState, currentState: 'REHEARSAL' };
    const next = appReducer(state, { type: 'TOGGLE_CHECKLIST_ITEM', payload: 'item1' });
    expect(next).toEqual(state);
    expect(next.context.checklistState).toEqual({});
  });

  it('ignores ANSWER_REHEARSAL if not in REHEARSAL state', () => {
    const state: MachineState = { ...initialState, currentState: 'CHECKLIST' };
    const next = appReducer(state, { type: 'ANSWER_REHEARSAL', payload: { questionId: 'q1', answerIndex: 2 } });
    expect(next).toEqual(state);
    expect(next.context.rehearsalAnswers).toEqual({});
  });

  it('ignores FINISH action if not in REHEARSAL state', () => {
    const state: MachineState = { ...initialState, currentState: 'CHECKLIST' };
    const next = appReducer(state, {
      type: 'FINISH',
      payload: { totalQuestions: 1, totalChecklistItems: 1, expectedAnswers: { q1: 0 } },
    });
    expect(next.currentState).toBe('CHECKLIST');
  });

  it('HYDRATE replaces entire state unconditionally', () => {
    const hydrated: MachineState = {
      currentState: 'RESULT',
      context: {
        language: 'hi',
        checklistState: { doc: true },
        rehearsalAnswers: { q1: 0 },
        readinessScore: 75,
      },
    };
    const next = appReducer(initialState, { type: 'HYDRATE', payload: hydrated });
    expect(next).toEqual(hydrated);
  });

  it('RESTART clears checklist and rehearsal answers', () => {
    const state: MachineState = {
      currentState: 'RESULT',
      context: {
        language: 'es',
        checklistState: { item1: true, item2: true },
        rehearsalAnswers: { q1: 1, q2: 0 },
        readinessScore: 80,
      },
    };
    const next = appReducer(state, { type: 'RESTART' });
    expect(next.context.checklistState).toEqual({});
    expect(next.context.rehearsalAnswers).toEqual({});
    expect(next.context.readinessScore).toBe(0);
  });

  it('RESTART resets to LANDING regardless of current state', () => {
    const states: MachineState['currentState'][] = ['CHECKLIST', 'REHEARSAL', 'RESULT', 'TIMELINE'];
    for (const currentState of states) {
      const state: MachineState = { ...initialState, currentState };
      expect(appReducer(state, { type: 'RESTART' }).currentState).toBe('LANDING');
    }
  });

  it('SELECT_LANGUAGE works from any step without side effects', () => {
    const steps: MachineState['currentState'][] = [
      'LANDING', 'ONBOARDING', 'LANGUAGE_SELECT', 'TIMELINE', 'CHECKLIST', 'REHEARSAL', 'RESULT',
    ];
    for (const currentState of steps) {
      const state: MachineState = { ...initialState, currentState };
      const next = appReducer(state, { type: 'SELECT_LANGUAGE', payload: 'hi' });
      expect(next.context.language).toBe('hi');
      expect(next.currentState).toBe(currentState); // step unchanged
    }
  });

  it('unknown action type returns state unchanged', () => {
    // @ts-expect-error intentional unknown action for runtime safety test
    const next = appReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(next).toEqual(initialState);
  });

  it('state is immutable — reducer never mutates the input state', () => {
    const frozen = Object.freeze({
      ...initialState,
      context: Object.freeze({ ...initialState.context }),
    });
    // This should not throw even though the object is frozen
    expect(() => appReducer(frozen, { type: 'START' })).not.toThrow();
  });

  it('multiple TOGGLE_CHECKLIST_ITEM calls toggle correctly', () => {
    let state: MachineState = { ...initialState, currentState: 'CHECKLIST' };
    state = appReducer(state, { type: 'TOGGLE_CHECKLIST_ITEM', payload: 'x' });
    expect(state.context.checklistState['x']).toBe(true);
    state = appReducer(state, { type: 'TOGGLE_CHECKLIST_ITEM', payload: 'x' });
    expect(state.context.checklistState['x']).toBe(false);
    state = appReducer(state, { type: 'TOGGLE_CHECKLIST_ITEM', payload: 'x' });
    expect(state.context.checklistState['x']).toBe(true);
  });
});
