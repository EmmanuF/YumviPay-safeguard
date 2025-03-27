
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';
import { useLocale } from '@/contexts/LocaleContext';
import LocaleSwitcher from '@/components/LocaleSwitcher';

interface ActionButtonsProps {
  handleNavigation: (path: string) => void;
  handleStarted: () => void;
  isNavigating: boolean;
  isHomePage: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleNavigation,
  handleStarted,
  isNavigating,
  isHomePage,
}) => {
  const { isLoggedIn } = useAuth();
  const { t } = useLocale();

  return (
    <div className="flex items-center space-x-5">
      <LocaleSwitcher />
      
      {!isLoggedIn ? (
        <button
          onClick={() => handleNavigation('/signin')}
          className={cn(
            "text-sm font-medium transition-colors px-3 py-1.5 rounded-md",
            isHomePage ? "text-primary-500 hover:text-primary-600 hover:bg-primary-50/30" : "text-white/80 hover:text-white hover:bg-white/10"
          )}
          disabled={isNavigating}
        >
          {t('auth.signin')}
        </button>
      ) : (
        <button
          onClick={() => handleNavigation('/profile')}
          className={cn(
            "text-sm font-medium transition-colors px-3 py-1.5 rounded-md",
            isHomePage ? "text-primary-500 hover:text-primary-600 hover:bg-primary-50/30" : "text-white/80 hover:text-white hover:bg-white/10"
          )}
          disabled={isNavigating}
        >
          {t('nav.profile')}
        </button>
      )}
      
      <button
        onClick={handleStarted}
        className={cn(
          isHomePage 
            ? "bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-primary-500/20" 
            : "bg-white text-indigo-800 hover:bg-white/90 shadow-md shadow-black/5",
          "font-medium px-5 py-2 rounded-full transition-colors text-sm",
          isNavigating && "opacity-75 pointer-events-none"
        )}
        disabled={isNavigating}
      >
        {isLoggedIn ? t('nav.dashboard') : t('auth.signup')}
      </button>
    </div>
  );
};

export default ActionButtons;
