
import React from 'react';
import { cn } from '@/lib/utils';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';

interface NavActionsProps {
  handleNavigation: (path: string) => void;
  handleStarted: () => void;
  isNavigating: boolean;
  isAdmin: boolean;
}

const NavActions: React.FC<NavActionsProps> = ({ 
  handleNavigation, 
  handleStarted, 
  isNavigating,
  isAdmin 
}) => {
  const { isLoggedIn } = useAuth();
  const { t } = useLocale();
  
  return (
    <div className="flex items-center space-x-4">
      <LocaleSwitcher />
      
      {!isLoggedIn ? (
        <button
          onClick={() => handleNavigation('/signin')}
          className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          disabled={isNavigating}
        >
          {t('auth.signin')}
        </button>
      ) : (
        <>
          {isAdmin && (
            <button
              onClick={() => handleNavigation('/admin')}
              className="text-sm font-medium bg-primary-800 text-white px-3 py-1 rounded-md hover:bg-primary-900 transition-colors"
              disabled={isNavigating}
            >
              Admin Panel
            </button>
          )}
          <button
            onClick={() => handleNavigation('/profile')}
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            disabled={isNavigating}
          >
            {t('nav.profile')}
          </button>
        </>
      )}
      
      <button
        onClick={handleStarted}
        className={cn(
          "bg-accent hover:bg-accent/80 text-primary-500 font-medium px-5 py-2 rounded-full transition-colors text-sm",
          isNavigating && "opacity-75 pointer-events-none"
        )}
        disabled={isNavigating}
      >
        {isLoggedIn ? t('nav.dashboard') : t('auth.signup')}
      </button>
    </div>
  );
};

export default NavActions;
