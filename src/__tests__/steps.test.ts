import { describe, it, expect } from 'vitest';
import { getNextStep, JOURNEY_STEPS } from '../lib/journey/steps';
import { AppState } from '../types/journey';

describe('getNextStep', () => {
  it('advances from LANDING to ONBOARDING', () => {
    expect(getNextStep('LANDING')).toBe('ONBOARDING');
  });

  it('advances from ONBOARDING to LANGUAGE_SELECT', () => {
    expect(getNextStep('ONBOARDING')).toBe('LANGUAGE_SELECT');
  });

  it('advances from LANGUAGE_SELECT to TIMELINE', () => {
    expect(getNextStep('LANGUAGE_SELECT')).toBe('TIMELINE');
  });

  it('advances from TIMELINE to CHECKLIST', () => {
    expect(getNextStep('TIMELINE')).toBe('CHECKLIST');
  });

  it('advances from CHECKLIST to REHEARSAL', () => {
    expect(getNextStep('CHECKLIST')).toBe('REHEARSAL');
  });

  it('advances from REHEARSAL to RESULT', () => {
    expect(getNextStep('REHEARSAL')).toBe('RESULT');
  });

  it('stays on RESULT (terminal state — no further step)', () => {
    expect(getNextStep('RESULT')).toBe('RESULT');
  });

  it('covers every step in JOURNEY_STEPS sequence', () => {
    for (let i = 0; i < JOURNEY_STEPS.length - 1; i++) {
      expect(getNextStep(JOURNEY_STEPS[i])).toBe(JOURNEY_STEPS[i + 1]);
    }
  });

  it('is deterministic — same input always gives same output', () => {
    const steps: AppState[] = ['LANDING', 'ONBOARDING', 'LANGUAGE_SELECT', 'CHECKLIST'];
    for (const step of steps) {
      expect(getNextStep(step)).toBe(getNextStep(step));
    }
  });
});
