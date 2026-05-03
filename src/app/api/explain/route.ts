import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/ai/gemini';
import { generateExplanationPrompt } from '@/lib/ai/prompts';
import { validateAIExplanation } from '@/lib/ai/validator';
import { Language } from '@/types/journey';
import { MAX_CONTEXT_CHARS, RATE_LIMIT_MS } from '@/lib/config';

const ALLOWED_LANGUAGES: readonly Language[] = ['en', 'es', 'hi'];

/**
 * In-process rate limiter: 1 call per RATE_LIMIT_MS per IP.
 * Serverless note: map resets per container — sufficient for abuse prevention
 * without requiring an external Redis dependency.
 */
const rateLimitMap = new Map<string, number>();

function isValidLanguage(lang: unknown): lang is Language {
  return typeof lang === 'string' && (ALLOWED_LANGUAGES as string[]).includes(lang);
}

/** Strip characters that enable prompt-injection before forwarding to Gemini */
function sanitizeContext(raw: string): string {
  return raw.replace(/["{}\[\]\\]/g, '').slice(0, MAX_CONTEXT_CHARS).trim();
}

export async function POST(req: Request) {
  // ── Rate limiting ────────────────────────────────────────────────────────
  const ip =
    req.headers.get('x-forwarded-for') ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const lastCall = rateLimitMap.get(ip) ?? 0;
  if (Date.now() - lastCall < RATE_LIMIT_MS) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 },
    );
  }
  rateLimitMap.set(ip, Date.now());

  try {
    const body = await req.json();
    const context: unknown = body.context;
    const language: unknown = body.language;

    // ── Input validation ──────────────────────────────────────────────────
    if (!context || typeof context !== 'string' || context.trim().length === 0) {
      return NextResponse.json({ error: 'Missing or invalid context' }, { status: 400 });
    }

    if (context.length > MAX_CONTEXT_CHARS) {
      return NextResponse.json({ error: 'Context exceeds maximum length' }, { status: 400 });
    }

    if (!isValidLanguage(language)) {
      return NextResponse.json({ error: 'Invalid or missing language' }, { status: 400 });
    }

    // ── AI call ───────────────────────────────────────────────────────────
    const model = getGeminiModel();
    if (!model) {
      // Graceful fallback when Vertex AI is not configured
      return NextResponse.json({
        explanation: getDefaultFallback(language),
        isFallback: true,
      });
    }

    const safeContext = sanitizeContext(context);
    const prompt = generateExplanationPrompt(safeContext, language);
    const result = await model.generateContent(prompt);

    // Extract text safely from Gemini response structure
    let rawText = '';
    if (
      result.response &&
      result.response.candidates &&
      result.response.candidates.length > 0
    ) {
      const parts = result.response.candidates[0].content.parts;
      rawText = parts.map(p => p.text ?? '').join('');
    }

    const validatedExplanation = validateAIExplanation(rawText);

    if (!validatedExplanation) {
      console.warn('AI response failed validation. Falling back.');
      return NextResponse.json({
        explanation: getDefaultFallback(language),
        isFallback: true,
      });
    }

    return NextResponse.json({
      explanation: validatedExplanation,
      isFallback: false,
    });

  } catch (error) {
    console.error('Explain API Error:', error);
    return NextResponse.json({
      explanation: getDefaultFallback('en'),
      isFallback: true,
    });
  }
}

function getDefaultFallback(lang: Language): string {
  const fallbacks: Record<Language, string> = {
    en: 'Sorry, I cannot explain this right now.',
    es: 'Lo siento, no puedo explicar esto en este momento.',
    hi: 'क्षमा करें, मैं अभी यह नहीं समझा सकता।',
  };
  return fallbacks[lang] ?? fallbacks.en;
}
