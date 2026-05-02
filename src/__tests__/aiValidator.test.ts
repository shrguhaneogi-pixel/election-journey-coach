import { describe, it, expect } from 'vitest';
import { validateAIExplanation } from '../lib/ai/validator';

describe('validateAIExplanation', () => {
  // Null / empty guards
  it('returns null for null input', () => {
    expect(validateAIExplanation(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(validateAIExplanation(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(validateAIExplanation('')).toBeNull();
  });

  it('returns null for whitespace-only string', () => {
    expect(validateAIExplanation('   ')).toBeNull();
  });

  // Length guard
  it('returns null when text exceeds 500 characters', () => {
    const longText = 'a'.repeat(501);
    expect(validateAIExplanation(longText)).toBeNull();
  });

  it('accepts text exactly 500 characters', () => {
    const text = 'a'.repeat(500);
    expect(validateAIExplanation(text)).toBe(text);
  });

  // HTML injection guard
  it('returns null for text containing an HTML tag', () => {
    expect(validateAIExplanation('Hello <b>world</b>')).toBeNull();
  });

  it('returns null for self-closing HTML tag', () => {
    expect(validateAIExplanation('Line<br/>')).toBeNull();
  });

  it('returns null for script tag', () => {
    expect(validateAIExplanation('<script>alert(1)</script>')).toBeNull();
  });

  // Command injection guard
  it('returns null for text containing {action: ...}', () => {
    expect(validateAIExplanation('Do this {action: NEXT}')).toBeNull();
  });

  it('returns null for text containing {type: ...}', () => {
    expect(validateAIExplanation('{type: FINISH}')).toBeNull();
  });

  it('returns null for text containing {dispatch: ...}', () => {
    expect(validateAIExplanation('Call {dispatch: restart}')).toBeNull();
  });

  it('returns null for {state: ...} pattern', () => {
    expect(validateAIExplanation('Current {state: LANDING}')).toBeNull();
  });

  // Valid text
  it('returns trimmed valid text', () => {
    expect(validateAIExplanation('  Valid explanation.  ')).toBe('Valid explanation.');
  });

  it('allows text with curly braces not matching command pattern', () => {
    expect(validateAIExplanation('Check {your} ID card.')).toBe('Check {your} ID card.');
  });

  it('allows multilingual text', () => {
    const hindi = 'अपना पहचान पत्र लाएं।';
    expect(validateAIExplanation(hindi)).toBe(hindi);
  });

  it('is deterministic — same input always same output', () => {
    const text = 'Bring your voter ID.';
    expect(validateAIExplanation(text)).toBe(validateAIExplanation(text));
  });
});
