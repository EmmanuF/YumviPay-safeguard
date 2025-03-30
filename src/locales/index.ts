
import { en } from './en';
import { fr } from './fr';
import { Locale } from '@/types/locale';

// Export all translations in a single dictionary
export const translations: Record<Locale, any> = {
  en: en,
  fr: fr
};

// Export individual translations if needed elsewhere
export { en, fr };
