import { describe, it, expect } from 'vitest';
import { calculateReadiness } from '../lib/journey/readiness';
import { ContextState } from '../types/journey';

const baseContext = (): ContextState => ({
  language: 'en',
  checklistState: {},
  rehearsalAnswers: {},
  readinessScore: 0,
});

describe('calculateReadiness', () => {
  it('returns 0 when nothing is done', () => {
    const score = calculateReadiness(baseContext(), 3, { q1: 0, q2: 1, q3: 2 });
    expect(score).toBe(0);
  });

  it('returns 100 when all checklist items checked and all answers correct', () => {
    const ctx: ContextState = {
      ...baseContext(),
      checklistState: { item1: true, item2: true },
      rehearsalAnswers: { q1: 0, q2: 1 },
    };
    const score = calculateReadiness(ctx, 2, { q1: 0, q2: 1 });
    expect(score).toBe(100);
  });

  it('correctly weights checklist vs rehearsal (50% each)', () => {
    // 1 of 2 checked (50%) + 0 of 2 correct (0%) → 1/4 = 25%
    const ctx: ContextState = {
      ...baseContext(),
      checklistState: { item1: true, item2: false },
      rehearsalAnswers: { q1: 99, q2: 99 }, // both wrong
    };
    const score = calculateReadiness(ctx, 2, { q1: 0, q2: 1 });
    expect(score).toBe(25);
  });

  it('counts only true booleans in checklistState', () => {
    const ctx: ContextState = {
      ...baseContext(),
      checklistState: { item1: true, item2: false, item3: true },
    };
    const score = calculateReadiness(ctx, 3, {});
    expect(score).toBeCloseTo(66.67, 1);
  });

  it('handles empty expectedAnswers gracefully', () => {
    const ctx: ContextState = {
      ...baseContext(),
      checklistState: { item1: true },
    };
    const score = calculateReadiness(ctx, 1, {});
    expect(score).toBe(100);
  });

  it('returns 0 when maxPossibleScore is 0', () => {
    const score = calculateReadiness(baseContext(), 0, {});
    expect(score).toBe(0);
  });

  it('ignores extra answers not in expectedAnswers', () => {
    const ctx: ContextState = {
      ...baseContext(),
      checklistState: { item1: true },
      rehearsalAnswers: { q1: 0, extraQ: 99 }, // extraQ not in expected
    };
    const score = calculateReadiness(ctx, 1, { q1: 0 });
    // 1 checklist + 1 correct answer = 2/2 = 100%
    expect(score).toBe(100);
  });

  it('is deterministic — same inputs always produce same output', () => {
    const ctx: ContextState = {
      ...baseContext(),
      checklistState: { a: true, b: false },
      rehearsalAnswers: { q1: 1 },
    };
    const expected = { q1: 1, q2: 0 };
    const run1 = calculateReadiness(ctx, 2, expected);
    const run2 = calculateReadiness(ctx, 2, expected);
    expect(run1).toBe(run2);
  });
});
