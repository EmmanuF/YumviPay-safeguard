
// Define available locales
export type Locale = 'en' | 'fr';

export interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}
