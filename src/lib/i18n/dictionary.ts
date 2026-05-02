import en from '../../../content/locales/en.json';
import es from '../../../content/locales/es.json';
import hi from '../../../content/locales/hi.json';
import { Language } from '@/types/journey';

const locales = {
  en,
  es,
  hi
};

export function getDictionary(lang: Language) {
  return locales[lang] || locales.en;
}
