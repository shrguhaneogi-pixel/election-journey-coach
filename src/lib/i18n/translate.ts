'use server';

import { v2 } from '@google-cloud/translate';
import { Language } from '@/types/journey';

const { Translate } = v2;

let translateClient: v2.Translate | null = null;

/** Lazy-initializes the Translation client on first call. Avoids crashing on boot
 *  in environments where GOOGLE_APPLICATION_CREDENTIALS is absent (CI, local dev). */
function getTranslateClient(): v2.Translate | null {
  if (translateClient) return translateClient;
  try {
    translateClient = new Translate();
    return translateClient;
  } catch {
    console.warn('Google Cloud Translation not configured. Falling back to static text.');
    return null;
  }
}

export async function translateText(text: string, targetLanguage: Language): Promise<string> {
  const client = getTranslateClient();
  if (!client) return text;

  try {
    const [translation] = await client.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Translation API failed:', error);
    return text;
  }
}

