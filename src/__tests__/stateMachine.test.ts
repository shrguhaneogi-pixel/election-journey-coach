import { describe, it, expect } from 'vitest';
import { appReducer, initialState } from '../lib/journey/state-machine';
import { MachineState } from '../types/journey';

describe('stateMachine', () => {
  it('should initialize with correct default state', () => {
    expect(initialState.currentState).toBe('LANDING');
    expect(initialState.context.language).toBe('en');
    expect(initialState.context.readinessScore).toBe(0);
  });

  it('should transition from LANDING to ONBOARDING on START', () => {
    const state = appReducer(initialState, { type: 'START' });
    expect(state.currentState).toBe('ONBOARDING');
  });

  it('should transition through NEXT sequence correctly', () => {
    let state = appReducer(initialState, { type: 'START' });
    
    state = appReducer(state, { type: 'NEXT' });
    expect(state.currentState).toBe('LANGUAGE_SELECT');

    state = appReducer(state, { type: 'NEXT' });
    expect(state.currentState).toBe('TIMELINE');

    state = appReducer(state, { type: 'NEXT' });
    expect(state.currentState).toBe('CHECKLIST');

    state = appReducer(state, { type: 'NEXT' });
    expect(state.currentState).toBe('REHEARSAL');
  });

  it('should update language on SELECT_LANGUAGE only when in LANGUAGE_SELECT state', () => {
    let state: MachineState = { ...initialState, currentState: 'LANGUAGE_SELECT' };
    state = appReducer(state, { type: 'SELECT_LANGUAGE', payload: 'es' });
    expect(state.context.language).toBe('es');

    // Should ignore if not in LANGUAGE_SELECT state
    state.currentState = 'LANDING';
    state = appReducer(state, { type: 'SELECT_LANGUAGE', payload: 'en' });
    expect(state.context.language).toBe('es');
  });

  it('should toggle checklist items on TOGGLE_CHECKLIST_ITEM', () => {
    let state: MachineState = { ...initialState, currentState: 'CHECKLIST' };
    
    state = appReducer(state, { type: 'TOGGLE_CHECKLIST_ITEM', payload: 'item1' });
    expect(state.context.checklistState['item1']).toBe(true);

    state = appReducer(state, { type: 'TOGGLE_CHECKLIST_ITEM', payload: 'item1' });
    expect(state.context.checklistState['item1']).toBe(false);
  });

  it('should record answers on ANSWER_REHEARSAL', () => {
    let state: MachineState = { ...initialState, currentState: 'REHEARSAL' };
    
    state = appReducer(state, { type: 'ANSWER_REHEARSAL', payload: { questionId: 'q1', answerIndex: 1 } });
    expect(state.context.rehearsalAnswers['q1']).toBe(1);
  });

  it('should calculate readiness score correctly on FINISH', () => {
    let state: MachineState = {
      currentState: 'REHEARSAL',
      context: {
        language: 'en',
        checklistState: { 'item1': true, 'item2': false },
        rehearsalAnswers: { 'q1': 1, 'q2': 0 },
        readinessScore: 0
      }
    };

    // 1 checked item + 1 correct answer (q1) = 2 points out of 4 (2 items + 2 questions) => 50%
    state = appReducer(state, { 
      type: 'FINISH', 
      payload: { 
        totalQuestions: 2, 
        totalChecklistItems: 2, 
        expectedAnswers: { 'q1': 1, 'q2': 1 } 
      } 
    });

    expect(state.currentState).toBe('RESULT');
    expect(state.context.readinessScore).toBe(50);
  });

  it('should calculate 100% readiness score correctly on FINISH', () => {
    let state: MachineState = {
      currentState: 'REHEARSAL',
      context: {
        language: 'en',
        checklistState: { 'item1': true, 'item2': true },
        rehearsalAnswers: { 'q1': 1, 'q2': 1 },
        readinessScore: 0
      }
    };

    state = appReducer(state, { 
      type: 'FINISH', 
      payload: { 
        totalQuestions: 2, 
        totalChecklistItems: 2, 
        expectedAnswers: { 'q1': 1, 'q2': 1 } 
      } 
    });

    expect(state.currentState).toBe('RESULT');
    expect(state.context.readinessScore).toBe(100);
  });

  it('should restart and preserve language', () => {
    let state: MachineState = {
      currentState: 'RESULT',
      context: {
        language: 'es',
        checklistState: { 'item1': true },
        rehearsalAnswers: { 'q1': 1 },
        readinessScore: 50
      }
    };

    state = appReducer(state, { type: 'RESTART' });
    expect(state.currentState).toBe('LANDING');
    expect(state.context.language).toBe('es');
    expect(state.context.checklistState).toEqual({});
    expect(state.context.readinessScore).toBe(0);
  });
});
