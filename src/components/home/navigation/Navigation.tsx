
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Clock, User, UserPlus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/LocaleContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavItem, NavigationProps } from './types';
import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';
import ActionButtons from './ActionButtons';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

const Navigation: React.FC<NavigationProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const [isNavigating, setIsNavigating] = useState(false);
  const { isLoggedIn, signOut } = useAuth();
  const { toast } = useToast();
  
  const navItems: NavItem[] = [
    {
      name: t('nav.home'),
      icon: <Home className="w-5 h-5" />,
      path: '/',
    },
    {
      name: t('nav.send'),
      icon: <Send className="w-5 h-5" />,
      path: '/send',
    },
    {
      name: t('nav.recipients'),
      icon: <UserPlus className="w-5 h-5" />,
      path: '/recipients',
    },
    {
      name: t('nav.history'),
      icon: <Clock className="w-5 h-5" />,
      path: '/history',
    },
    {
      name: t('nav.profile'),
      icon: <User className="w-5 h-5" />,
      path: '/profile',
    },
  ];
  
  const handleNavigation = (path: string) => {
    if (isNavigating || path === location.pathname) return;
    
    console.log(`Navigating to: ${path}`);
    setIsNavigating(true);
    
    setTimeout(() => {
      navigate(path);
      setTimeout(() => setIsNavigating(false), 400);
    }, 50);
  };

  const handleStarted = () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    setTimeout(() => {
      if (onGetStarted) {
        onGetStarted();
      } else {
        navigate(isLoggedIn ? '/history' : '/signin');
      }
      setTimeout(() => setIsNavigating(false), 400);
    }, 50);
  };

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
  
  if (isMobile && location.pathname !== '/') {
    return null;
  }
  
  const isHomePage = location.pathname === '/';
  
  return (
    <header className={cn(
      "px-4 py-2 relative z-30",
      !isHomePage ? "bg-indigo-800 text-white shadow-md" : "bg-transparent"
    )}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div 
            className={cn(
              "text-2xl font-bold cursor-pointer",
              isHomePage ? "text-primary-700" : "text-white"
            )} 
            onClick={() => !isNavigating && navigate('/')}
          >
            {t('app.name')}
          </div>

          {/* Sign Out Button (bottom left) - Only show when logged in */}
          {isLoggedIn && isHomePage && (
            <button
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700 transition-colors p-1.5 ml-6 rounded-md hover:bg-red-50/30"
              title={t('auth.signout')}
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <DesktopNavigation 
          navItems={navItems}
          handleNavigation={handleNavigation}
          isNavigating={isNavigating}
          isHomePage={isHomePage}
        />
        
        <div className="flex items-center space-x-5">
          <LocaleSwitcher />
          
          <ActionButtons 
            handleNavigation={handleNavigation}
            handleStarted={handleStarted}
            isNavigating={isNavigating}
            isHomePage={isHomePage}
          />
        </div>
      </div>
      
      {isHomePage && isMobile && (
        <MobileNavigation 
          navItems={navItems}
          handleNavigation={handleNavigation}
          isNavigating={isNavigating}
        />
      )}
    </header>
  );
};

export default Navigation;
