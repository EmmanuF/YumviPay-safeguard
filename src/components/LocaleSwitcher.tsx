
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { Locale } from '@/types/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

// Country flag icons for language selection
const LanguageFlags: Record<Locale, { flag: string, label: string }> = {
  en: { 
    flag: '🇺🇸', 
    label: 'English'
  },
  fr: { 
    flag: '🇫🇷', 
    label: 'Français'
  }
};

const LocaleSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useLocale();
  const isMobile = useIsMobile();
  
  const locales: { key: Locale; label: string }[] = [
    { key: 'en', label: 'English' },
    { key: 'fr', label: 'Français' },
  ];
  
  // Fix: Ensure we have a valid locale and properly display it
  const currentLocale = locale === 'en' || locale === 'fr' ? locale : 'en';
  
  const handleLanguageChange = (selectedLocale: Locale) => {
    console.log(`Changing language to: ${selectedLocale}`);
    setLocale(selectedLocale);
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
          <span className="text-base">{LanguageFlags[currentLocale].flag}</span>
          <span className="text-sm">{LanguageFlags[currentLocale].label}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          <span className="sr-only">{t('settings.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white/95 backdrop-blur-md border border-primary-100/30 shadow-lg"
      >
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.key}
            className={`px-4 py-2.5 flex items-center gap-2 ${
              currentLocale === l.key ? "bg-primary-50 text-primary-700" : "hover:bg-primary-50/50"
            }`}
            onClick={() => handleLanguageChange(l.key)}
          >
            <span className="text-base">{LanguageFlags[l.key].flag}</span>
            <span>{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
