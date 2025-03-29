
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
export const translate = (key: string, locale: Locale, params?: Record<string, string>): string => {
  // Ensure we're using a valid locale
  const safeLocale = locale === 'en' || locale === 'fr' ? locale : 'en';
  
  // Get translation or fall back to key if not found
  const translation = translations[safeLocale][key];
  if (!translation) {
    console.warn(`Translation key not found: ${key} for locale: ${safeLocale}`);
    return key;
  }
  
  let text = translation;
  
  // Replace parameters if provided
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{{${param}}}`, value);
    });
  }
  
  return text;
};

// Get flag emoji for locale
export const getLocaleFlag = (locale: Locale): string => {
  const flagMap: Record<Locale, string> = {
    'en': '🇺🇸',
    'fr': '🇫🇷'
  };
  return flagMap[locale] || '🇺🇸';
};

// Get locale name
export const getLocaleName = (locale: Locale): string => {
  const nameMap: Record<Locale, string> = {
    'en': 'English',
    'fr': 'Français'
  };
  return nameMap[locale] || 'English';
};

// Format date using the locale
export const formatDateForLocale = (date: Date, locale: Locale): string => {
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US');
};

// Format currency using the locale
export const formatCurrencyForLocale = (
  amount: number,
  currency: string,
  locale: Locale
): string => {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
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
      const { data: profile } = await supabase
        .from('profiles')
        .select('language_preference')
        .eq('id', session.user.id)
        .single();
        
      if (profile?.language_preference) {
        const locale = profile.language_preference as Locale;
        saveLocale(locale);
        return locale;
      }
      
      // Set default locale in profile
      localStorage.setItem('yumvi-locale', 'en');
      
      // Try to update profile with default locale
      try {
        await supabase
          .from('profiles')
          .update({ language_preference: 'en' })
          .eq('id', session.user.id);
      } catch (error) {
        console.error('Failed to update profile language preference:', error);
      }
    }
    
    // Get browser language as fallback
    const browserLocale = navigator.language.split('-')[0];
    if (browserLocale === 'fr') {
      saveLocale('fr');
      return 'fr';
    }
    
    // Ultimate fallback to English
    saveLocale('en');
    return 'en';
  } catch (error) {
    console.error('Error loading locale from profile:', error);
    // Ensure we always have a valid locale by setting it to 'en'
    localStorage.setItem('yumvi-locale', 'en');
    return 'en';
  }
};

// Update user profile with locale preference
export const saveLocaleToProfile = async (locale: Locale): Promise<void> => {
  try {
    // Save locally first
    saveLocale(locale);
    
    // If authenticated, save to profile
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from('profiles')
        .update({ language_preference: locale })
        .eq('id', session.user.id);
      
      console.log('Updated profile language preference to:', locale);
    }
  } catch (error) {
    console.error('Failed to save locale to profile:', error);
  }
};
