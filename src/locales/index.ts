
import enTranslations from './en';
import frTranslations from './fr';
import { Locale } from '@/types/locale';

// Export all translations in a single dictionary
// We need to use a more specific type than Record<string, string> since 
// our translations are nested objects
export const translations: Record<Locale, typeof enTranslations> = {
  en: enTranslations,
  fr: frTranslations
};

export { default as enTranslations } from './en';
export { default as frTranslations } from './fr';
