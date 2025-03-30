
import enTranslations from './en';
import frTranslations from './fr';
import { Locale } from '@/types/locale';

// Export all translations in a single dictionary
export const translations: Record<Locale, Record<string, string>> = {
  en: enTranslations,
  fr: frTranslations
};

export { default as enTranslations } from './en';
export { default as frTranslations } from './fr';
