
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '@/locales';
import { Locale } from '@/types/locale';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    // Try to get the locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'fr')) {
      setLocale(savedLocale);
    } else {
      // Set default based on browser language
      const browserLocale = navigator.language.split('-')[0] as Locale;
      if (browserLocale === 'fr') {
        setLocale('fr');
      }
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  // Translation function
  const translate = (key: string, params?: Record<string, string>): string => {
    // Get the translation for the current locale
    const currentTranslations = translations[locale] || translations.en;
    
    let text = currentTranslations[key] || key;
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{{${param}}}`, value);
      });
    }
    
    // For debugging purposes, log missing translations
    if (text === key && process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation for key: ${key} in locale: ${locale}`);
    }
    
    return text;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: changeLocale, t: translate }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
