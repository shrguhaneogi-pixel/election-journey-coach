export type AppState =
  | 'LANDING'
  | 'ONBOARDING'
  | 'LANGUAGE_SELECT'
  | 'TIMELINE'
  | 'CHECKLIST'
  | 'REHEARSAL'
  | 'RESULT';

export type Language = 'en' | 'es' | 'hi';

export interface ContextState {
  language: Language;
  checklistState: Record<string, boolean>;
  rehearsalAnswers: Record<string, number>;
  readinessScore: number;
}

export type Action =
  | { type: 'START' }
  | { type: 'NEXT' }
  | { type: 'SELECT_LANGUAGE'; payload: Language }
  | { type: 'TOGGLE_CHECKLIST_ITEM'; payload: string }
  | { type: 'ANSWER_REHEARSAL'; payload: { questionId: string; answerIndex: number } }
  | { type: 'FINISH'; payload: { totalQuestions: number; totalChecklistItems: number; expectedAnswers: Record<string, number> } }
  | { type: 'RESTART' }
  | { type: 'HYDRATE'; payload: MachineState };

export interface MachineState {
  currentState: AppState;
  context: ContextState;
}
