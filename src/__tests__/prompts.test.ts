import { describe, it, expect } from 'vitest';
import { generateExplanationPrompt } from '../lib/ai/prompts';
import { Language } from '../types/journey';

describe('generateExplanationPrompt', () => {
  it('includes the context in the output', () => {
    const prompt = generateExplanationPrompt('voter ID card', 'en');
    expect(prompt).toContain('voter ID card');
  });

  it('specifies English as the output language', () => {
    const prompt = generateExplanationPrompt('polling station', 'en');
    expect(prompt).toContain('English');
  });

  it('specifies Spanish as the output language', () => {
    const prompt = generateExplanationPrompt('polling station', 'es');
    expect(prompt).toContain('Spanish');
  });

  it('specifies Hindi as the output language', () => {
    const prompt = generateExplanationPrompt('polling station', 'hi');
    expect(prompt).toContain('Hindi');
  });

  it('includes the no-markdown rule', () => {
    const prompt = generateExplanationPrompt('test', 'en');
    expect(prompt).toMatch(/markdown/i);
  });

  it('includes the no-legal-advice rule', () => {
    const prompt = generateExplanationPrompt('test', 'en');
    expect(prompt).toMatch(/legal/i);
  });

  it('returns a non-empty string for all supported languages', () => {
    const langs: Language[] = ['en', 'es', 'hi'];
    for (const lang of langs) {
      const prompt = generateExplanationPrompt('voter registration', lang);
      expect(typeof prompt).toBe('string');
      expect(prompt.trim().length).toBeGreaterThan(0);
    }
  });

  it('is deterministic — same args always produce same prompt', () => {
    const p1 = generateExplanationPrompt('Bring your ID', 'en');
    const p2 = generateExplanationPrompt('Bring your ID', 'en');
    expect(p1).toBe(p2);
  });

  it('wraps context in quotes', () => {
    const prompt = generateExplanationPrompt('voter registration deadline', 'en');
    expect(prompt).toContain('"voter registration deadline"');
  });
});
