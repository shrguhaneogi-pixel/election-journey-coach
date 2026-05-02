import { Language } from '@/types/journey';

export function generateExplanationPrompt(context: string, language: Language): string {
  const languageNames: Record<Language, string> = {
    en: 'English',
    es: 'Spanish',
    hi: 'Hindi'
  };

  return `
You are a highly helpful and concise voting assistant. Your ONLY job is to explain the following concept simply and clearly.

Concept to explain: "${context}"

Rules:
1. Explain it in 2 or 3 short sentences.
2. Keep the tone encouraging and accessible.
3. Do NOT invent new requirements or give legal advice.
4. Output the explanation in ${languageNames[language]}.
5. Do NOT include any Markdown formatting or emojis in the response.

Explanation:`;
}
