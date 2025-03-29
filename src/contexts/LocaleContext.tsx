
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '@/locales';
import { Locale } from '@/types/locale';
import { 
  getStoredLocale, 
  saveLocale, 
  translate as translateUtil, 
  loadLocaleFromProfile,
  saveLocaleToProfile
} from '@/utils/localeUtils';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize locale on mount
  useEffect(() => {
    const initLocale = async () => {
      try {
        setIsLoading(true);
        // Try to load from profile (includes localStorage check)
        const userLocale = await loadLocaleFromProfile();
        setLocaleState(userLocale);
      } catch (error) {
        console.error('Error initializing locale:', error);
        // Fallback to browser language
        const browserLocale = navigator.language.split('-')[0] as Locale;
        if (browserLocale === 'fr') {
          setLocaleState('fr');
          saveLocale('fr');
        } else {
          setLocaleState('en');
          saveLocale('en');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    initLocale();
  }, []);

  const setLocale = async (newLocale: Locale) => {
    if (newLocale !== locale) {
      console.log(`Changing locale from ${locale} to ${newLocale}`);
      setLocaleState(newLocale);
      
      // Save to both localStorage and user profile if available
      await saveLocaleToProfile(newLocale);
    }
  };

  // Enhanced translation function with parameter support
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
    <LocaleContext.Provider value={{ locale, setLocale, t: translate, isLoading }}>
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
