
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, LocaleContextType } from '@/types/locale';
import { translate, getStoredLocale, saveLocale, loadLocaleFromProfile } from '@/utils/localeUtils';

// Create the context with a default undefined value
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Set a default locale that is guaranteed to be valid
  const [locale, setLocale] = useState<Locale>('en');
  
  // Initialize locale from stored preference or user profile
  useEffect(() => {
    const initializeLocale = async () => {
      const userLocale = await loadLocaleFromProfile();
      setLocale(userLocale);
    };
    
    initializeLocale();
  }, []);
  
  // Update locale in localStorage
  const updateLocale = async (newLocale: Locale) => {
    // Make sure we're setting a valid locale
    if (newLocale !== 'en' && newLocale !== 'fr') {
      console.warn(`Invalid locale requested: ${newLocale}, defaulting to 'en'`);
      newLocale = 'en';
    }
    
    console.log(`Setting new locale: ${newLocale}`);
    setLocale(newLocale);
    saveLocale(newLocale);
    
    console.log(`Locale switched to: ${newLocale}`);
  };
  
  // Translation function
  const t = (key: string): string => {
    return translate(key, locale);
  };
  
  // For debugging
  useEffect(() => {
    console.log('Current locale in context:', locale);
  }, [locale]);
  
  const value = {
    locale,
    setLocale: updateLocale,
    t
  };
  
  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

export { Locale };
