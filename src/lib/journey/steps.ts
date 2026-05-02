import { AppState } from '@/types/journey';

export const JOURNEY_STEPS: AppState[] = [
  'LANDING',
  'ONBOARDING',
  'LANGUAGE_SELECT',
  'TIMELINE',
  'CHECKLIST',
  'REHEARSAL',
  'RESULT',
];

export function getNextStep(current: AppState): AppState {
  const index = JOURNEY_STEPS.indexOf(current);
  if (index >= 0 && index < JOURNEY_STEPS.length - 1) {
    return JOURNEY_STEPS[index + 1];
  }
  return current;
}
