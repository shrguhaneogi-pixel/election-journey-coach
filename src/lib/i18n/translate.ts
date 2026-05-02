'use server';

import { v2 } from '@google-cloud/translate';
import { Language } from '@/types/journey';

const { Translate } = v2;

// Initialize the client conditionally to avoid crashing if credentials aren't set yet.
let translateClient: v2.Translate | null = null;
try {
  // Uses GOOGLE_APPLICATION_CREDENTIALS from the environment
  translateClient = new Translate();
} catch (error) {
  console.warn("Google Cloud Translation initialized without credentials. Will fallback.");
}

export async function translateText(text: string, targetLanguage: Language): Promise<string> {
  if (!translateClient) {
    // Fallback if no credentials
    return text;
  }

  try {
    const [translation] = await translateClient.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error("Translation API failed:", error);
    // Always fallback to static original text
    return text;
  }
}
