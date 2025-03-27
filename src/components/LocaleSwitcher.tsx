
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
import { motion } from 'framer-motion';

// Custom stylized globe icon that better matches the brand
const StylizedGlobe = () => {
  return (
    <motion.svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 0.6 }}
    >
      {/* Main circle (globe) */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Latitude lines */}
      <path d="M12 2C14.5 5 17 8.5 12 12C7 8.5 9.5 5 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 22C14.5 19 17 15.5 12 12C7 15.5 9.5 19 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Longitude lines */}
      <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 7H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </motion.svg>
  );
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
          size="icon"
          className={`relative ${isMobile ? "bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white/90" : "hover:bg-white/20"}`}
        >
          <StylizedGlobe />
          <span className="sr-only">{t('settings.language')}</span>
          <motion.div 
            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary-500 text-[8px] font-bold flex items-center justify-center text-white"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {currentLocale === 'en' ? 'EN' : 'FR'}
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-md border border-primary-100/30 shadow-lg">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.key}
            className={`px-4 py-2.5 ${currentLocale === l.key ? "bg-primary-50 text-primary-700" : "hover:bg-primary-50/50"}`}
            onClick={() => handleLanguageChange(l.key)}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
