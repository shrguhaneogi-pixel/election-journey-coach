import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/ai/gemini';
import { generateExplanationPrompt } from '@/lib/ai/prompts';
import { validateAIExplanation } from '@/lib/ai/validator';
import { Language } from '@/types/journey';

export async function POST(req: Request) {
  try {
    const { context, language } = await req.json();

    if (!context || !language) {
      return NextResponse.json({ error: 'Missing context or language' }, { status: 400 });
    }

    const model = getGeminiModel();
    if (!model) {
      // Graceful fallback if Vertex AI isn't configured
      return NextResponse.json({ 
        explanation: getDefaultFallback(language as Language),
        isFallback: true 
      });
    }

    const prompt = generateExplanationPrompt(context, language as Language);
    const result = await model.generateContent(prompt);
    
    // Extract text safely depending on the Gemini API response structure
    let rawText = '';
    if (result.response && result.response.candidates && result.response.candidates.length > 0) {
       const parts = result.response.candidates[0].content.parts;
       rawText = parts.map(p => p.text || '').join('');
    }

    const validatedExplanation = validateAIExplanation(rawText);

    if (!validatedExplanation) {
      console.warn("AI response failed validation. Falling back.");
      return NextResponse.json({ 
        explanation: getDefaultFallback(language as Language),
        isFallback: true 
      });
    }

    return NextResponse.json({ 
      explanation: validatedExplanation,
      isFallback: false 
    });

  } catch (error) {
    console.error("Explain API Error:", error);
    return NextResponse.json({ 
      explanation: getDefaultFallback('en'), // Safe default
      isFallback: true 
    });
  }
}

function getDefaultFallback(lang: Language): string {
  const fallbacks: Record<Language, string> = {
    en: "Sorry, I cannot explain this right now.",
    es: "Lo siento, no puedo explicar esto en este momento.",
    hi: "क्षमा करें, मैं अभी यह नहीं समझा सकता।"
  };
  return fallbacks[lang] || fallbacks.en;
}
