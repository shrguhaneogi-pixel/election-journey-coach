import { Language } from '@/types/journey';

export const LOCALES: Record<Language, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  hi: { name: 'हिन्दी', flag: '🇮🇳' },
};

export function getLocaleName(lang: Language): string {
  return LOCALES[lang].name;
}
