import { MachineState, Action } from '@/types/journey';
import { getNextStep } from './steps';
import { calculateReadiness } from './readiness';
import { initialContext } from './context';

export function handleTransition(state: MachineState, action: Action): MachineState {
  switch (action.type) {
    case 'START':
      if (state.currentState === 'LANDING') {
        return { ...state, currentState: 'ONBOARDING' };
      }
      return state;

    case 'NEXT':
      return { ...state, currentState: getNextStep(state.currentState) };

    case 'SELECT_LANGUAGE':
      return {
        ...state,
        context: { ...state.context, language: action.payload },
      };

    case 'TOGGLE_CHECKLIST_ITEM':
      if (state.currentState === 'CHECKLIST') {
        const isChecked = !!state.context.checklistState[action.payload];
        return {
          ...state,
          context: {
            ...state.context,
            checklistState: {
              ...state.context.checklistState,
              [action.payload]: !isChecked,
            },
          },
        };
      }
      return state;

    case 'ANSWER_REHEARSAL':
      if (state.currentState === 'REHEARSAL') {
        return {
          ...state,
          context: {
            ...state.context,
            rehearsalAnswers: {
              ...state.context.rehearsalAnswers,
              [action.payload.questionId]: action.payload.answerIndex,
            },
          },
        };
      }
      return state;

    case 'FINISH':
      if (state.currentState === 'REHEARSAL') {
        const readinessScore = calculateReadiness(
          state.context,
          action.payload.totalChecklistItems,
          action.payload.expectedAnswers
        );

        return {
          ...state,
          currentState: 'RESULT',
          context: { ...state.context, readinessScore },
        };
      }
      return state;

    case 'RESTART':
      return {
        currentState: 'LANDING',
        context: { ...initialContext, language: state.context.language } // preserve language
      };

    default:
      return state;
  }
}
