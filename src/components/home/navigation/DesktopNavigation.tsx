
import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavItem as NavItemType } from './types';
import NavItem from './NavItem';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';

interface DesktopNavigationProps {
  navItems: NavItemType[];
  handleNavigation: (path: string) => void;
  isNavigating: boolean;
  isHomePage: boolean;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navItems,
  handleNavigation,
  isNavigating,
  isHomePage,
}) => {
  const location = useLocation();
  const { isLoggedIn, signOut } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();

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
    <div className="hidden md:flex items-center space-x-10">
      {navItems.slice(0, 3).map((item) => (
        <NavItem
          key={item.name}
          item={item}
          isActive={location.pathname === item.path}
          isHomePage={isHomePage}
          onClick={() => handleNavigation(item.path)}
          isNavigating={isNavigating}
        />
      ))}
      
      {/* Logout Icon - Only show when logged in */}
      {isLoggedIn && (
        <button
          onClick={handleSignOut}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            isHomePage 
              ? "text-primary-500/80 hover:text-primary-600 hover:bg-primary-50/30" 
              : "text-white/80 hover:text-white hover:bg-white/10"
          )}
          title={t('auth.signout')}
          disabled={isNavigating}
        >
          <LogOut className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default DesktopNavigation;
