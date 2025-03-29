
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';
import { useLocale } from '@/contexts/LocaleContext';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { isLoggedIn, signOut } = useAuth();
  const { t } = useLocale();
  const { toast } = useToast();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      toast({
        title: "Signing out...",
        description: "Please wait while we sign you out.",
      });
      
      await signOut();
      
      toast({
        title: "Sign out successful",
        description: "You have been signed out successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center space-x-5">
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
        <div className="flex items-center space-x-3">
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
          
          <button
            onClick={handleSignOut}
            className={cn(
              "text-sm font-medium transition-colors px-3 py-1.5 rounded-md flex items-center",
              isHomePage ? "text-destructive hover:text-destructive hover:bg-destructive/10" : "text-white/80 hover:text-white hover:bg-white/10"
            )}
            disabled={isNavigating}
          >
            <LogOut className="mr-1 h-3.5 w-3.5" />
            {t('auth.signout')}
          </button>
        </div>
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
        {isLoggedIn ? t('nav.history') : t('auth.signup')}
      </button>
    </div>
  );
};

export default ActionButtons;
