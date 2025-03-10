
import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLocale, Locale } from '@/contexts/LocaleContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LocaleSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useLocale();
  
  const locales: { key: Locale; label: string }[] = [
    { key: 'en', label: t('language.english') },
    { key: 'fr', label: t('language.french') },
  ];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('settings.language')}</span>
          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-primary-500 text-[8px] font-bold flex items-center justify-center text-white">
            {locale.toUpperCase()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.key}
            className={locale === l.key ? "bg-primary-50 text-primary-700" : ""}
            onClick={() => setLocale(l.key)}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
