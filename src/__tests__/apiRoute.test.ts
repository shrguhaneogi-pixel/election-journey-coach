/**
 * API Route tests — /api/explain (POST handler)
 *
 * Tests the HTTP handler directly (no network required).
 * Gemini model is mocked so tests remain deterministic.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock Gemini so no real API calls are made ──────────────────────────────
vi.mock('../lib/ai/gemini', () => ({
  getGeminiModel: vi.fn(),
}));

import { POST } from '../app/api/explain/route';
import { getGeminiModel } from '../lib/ai/gemini';

const makeRequest = (body: unknown) =>
  new Request('http://localhost/api/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `${Math.random()}` },
    body: JSON.stringify(body),
  });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/explain — input validation', () => {
  it('returns 400 for empty context', async () => {
    const res = await POST(makeRequest({ context: '', language: 'en' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/context/i);
  });

  it('returns 400 for whitespace-only context', async () => {
    const res = await POST(makeRequest({ context: '   ', language: 'en' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when context exceeds 300 characters', async () => {
    const res = await POST(makeRequest({ context: 'a'.repeat(301), language: 'en' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/length/i);
  });

  it('returns 400 for an invalid language', async () => {
    const res = await POST(makeRequest({ context: 'Voter ID', language: 'fr' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/language/i);
  });

  it('returns 400 when language is missing', async () => {
    const res = await POST(makeRequest({ context: 'Voter ID' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when context is missing', async () => {
    const res = await POST(makeRequest({ language: 'en' }));
    expect(res.status).toBe(400);
  });

  it('accepts context at exactly 300 characters', async () => {
    (getGeminiModel as ReturnType<typeof vi.fn>).mockReturnValue(null); // no model → fallback
    const res = await POST(makeRequest({ context: 'a'.repeat(300), language: 'en' }));
    // Should NOT be 400 — model unavailable triggers fallback 200
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.isFallback).toBe(true);
  });
});

describe('POST /api/explain — Gemini fallback path', () => {
  it('returns isFallback=true and 200 when model is not configured', async () => {
    (getGeminiModel as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const res = await POST(makeRequest({ context: 'Polling station', language: 'en' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.isFallback).toBe(true);
    expect(typeof body.explanation).toBe('string');
    expect(body.explanation.length).toBeGreaterThan(0);
  });

  it('returns Spanish fallback text when language is es', async () => {
    (getGeminiModel as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const res = await POST(makeRequest({ context: 'Polling station', language: 'es' }));
    const body = await res.json();
    expect(body.isFallback).toBe(true);
    expect(body.explanation).toContain('Lo siento');
  });

  it('returns Hindi fallback text when language is hi', async () => {
    (getGeminiModel as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const res = await POST(makeRequest({ context: 'Voter ID', language: 'hi' }));
    const body = await res.json();
    expect(body.isFallback).toBe(true);
    expect(body.explanation).toContain('क्षमा');
  });
});

describe('POST /api/explain — Gemini success path', () => {
  it('returns validated AI explanation with isFallback=false', async () => {
    const mockModel = {
      generateContent: vi.fn().mockResolvedValue({
        response: {
          candidates: [{
            content: { parts: [{ text: 'Bring your voter ID to the polling station.' }] },
          }],
        },
      }),
    };
    (getGeminiModel as ReturnType<typeof vi.fn>).mockReturnValue(mockModel);

    const res = await POST(makeRequest({ context: 'Voter ID', language: 'en' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.isFallback).toBe(false);
    expect(body.explanation).toBe('Bring your voter ID to the polling station.');
  });

  it('falls back when AI returns HTML (validation rejected)', async () => {
    const mockModel = {
      generateContent: vi.fn().mockResolvedValue({
        response: {
          candidates: [{
            content: { parts: [{ text: '<b>Click here</b> to proceed.' }] },
          }],
        },
      }),
    };
    (getGeminiModel as ReturnType<typeof vi.fn>).mockReturnValue(mockModel);

    const res = await POST(makeRequest({ context: 'Voter ID', language: 'en' }));
    const body = await res.json();
    expect(body.isFallback).toBe(true);
  });

  it('falls back when AI returns empty response', async () => {
    const mockModel = {
      generateContent: vi.fn().mockResolvedValue({
        response: { candidates: [] },
      }),
    };
    (getGeminiModel as ReturnType<typeof vi.fn>).mockReturnValue(mockModel);

    const res = await POST(makeRequest({ context: 'Voter ID', language: 'en' }));
    const body = await res.json();
    expect(body.isFallback).toBe(true);
  });

  it('returns 200 fallback (not 500) when Gemini throws', async () => {
    const mockModel = {
      generateContent: vi.fn().mockRejectedValue(new Error('Network failure')),
    };
    (getGeminiModel as ReturnType<typeof vi.fn>).mockReturnValue(mockModel);

    const res = await POST(makeRequest({ context: 'Voter ID', language: 'en' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.isFallback).toBe(true);
  });
});
