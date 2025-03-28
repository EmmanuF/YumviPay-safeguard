
import { Locale } from '@/types/locale';
import { translations } from '@/locales';
import { supabase } from '@/integrations/supabase/client';

// Get current locale from storage
export const getStoredLocale = (): Locale => {
  const storedLocale = localStorage.getItem('yumvi-locale');
  return (storedLocale === 'en' || storedLocale === 'fr') ? storedLocale as Locale : 'en';
};

// Save locale to storage
export const saveLocale = (locale: Locale): void => {
  localStorage.setItem('yumvi-locale', locale);
};

// Translation function
export const translate = (key: string, locale: Locale): string => {
  // Ensure we're using a valid locale
  const safeLocale = locale === 'en' || locale === 'fr' ? locale : 'en';
  
  // Get translation or fall back to key if not found
  const translation = translations[safeLocale][key];
  if (!translation) {
    console.warn(`Translation key not found: ${key} for locale: ${safeLocale}`);
    return key;
  }
  
  return translation;
};

// Get flag emoji for locale
export const getLocaleFlag = (locale: Locale): string => {
  const flagMap: Record<Locale, string> = {
    'en': '🇺🇸',
    'fr': '🇫🇷'
  };
  return flagMap[locale] || '🇺🇸';
};

// Load locale preferences from user profile
export const loadLocaleFromProfile = async (): Promise<Locale> => {
  try {
    // Try to get from localStorage first
    const storedLocale = localStorage.getItem('yumvi-locale');
    console.log('Stored locale:', storedLocale);
    
    if (storedLocale === 'en' || storedLocale === 'fr') {
      console.log('Setting locale from localStorage:', storedLocale);
      return storedLocale as Locale;
    }
    
    // If authenticated, try to get from user profile
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // First check if we need to update the profiles table
      const { data: hasLanguageColumn } = await supabase
        .from('profiles')
        .select('id') // Just select a valid column to test
        .limit(1)
        .single();
        
      // If we could fetch the profile, let's add a language preference
      if (hasLanguageColumn) {
        // We'll store the language preference in localStorage
        localStorage.setItem('yumvi-locale', 'en');
      }
    }
    
    return 'en'; // Default to English
  } catch (error) {
    console.error('Error loading locale from profile:', error);
    // Ensure we always have a valid locale by setting it to 'en'
    localStorage.setItem('yumvi-locale', 'en');
    return 'en';
  }
};
