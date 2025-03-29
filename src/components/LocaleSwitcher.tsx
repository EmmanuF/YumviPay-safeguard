
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { Locale } from '@/types/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { getLocaleFlag, getLocaleName } from '@/utils/localeUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

// Define available locales
const AVAILABLE_LOCALES: Locale[] = ['en', 'fr'];

const LocaleSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useLocale();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Fix: Ensure we have a valid locale
  const currentLocale = AVAILABLE_LOCALES.includes(locale) ? locale : 'en';
  
  const handleLanguageChange = async (selectedLocale: Locale) => {
    try {
      if (selectedLocale !== currentLocale) {
        console.log(`Changing language to: ${selectedLocale}`);
        await setLocale(selectedLocale);
        
        // Show toast notification on successful language change
        toast({
          title: t('language.changed'),
          description: selectedLocale === 'en' 
            ? 'Language changed to English'
            : 'Langue changée en Français',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Failed to change language:', error);
      toast({
        title: t('language.change_failed'),
        description: t('language.try_again'),
        variant: 'destructive',
      });
    }
  };
  
  // Debug the current locale value
  useEffect(() => {
    console.log('Current locale in LocaleSwitcher:', currentLocale);
  }, [currentLocale]);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={isMobile ? "secondary" : "ghost"} 
          size="sm"
          className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md h-auto ${
            isMobile 
              ? "bg-white/90 text-gray-800 backdrop-blur-sm shadow-sm hover:bg-white/95" 
              : "text-primary-500 hover:text-primary-600 hover:bg-primary-50/30"
          }`}
        >
          <span className="text-base">{getLocaleFlag(currentLocale)}</span>
          <span className="text-sm">{getLocaleName(currentLocale)}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          <span className="sr-only">{t('settings.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white/95 backdrop-blur-md border border-primary-100/30 shadow-lg"
      >
        {AVAILABLE_LOCALES.map((localeOption) => (
          <DropdownMenuItem
            key={localeOption}
            className={`px-4 py-2.5 flex items-center gap-2 ${
              currentLocale === localeOption ? "bg-primary-50 text-primary-700" : "hover:bg-primary-50/50"
            }`}
            onClick={() => handleLanguageChange(localeOption)}
          >
            <span className="text-base">{getLocaleFlag(localeOption)}</span>
            <span>{getLocaleName(localeOption)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
