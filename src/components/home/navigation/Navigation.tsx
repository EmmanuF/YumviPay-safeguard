
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Clock, User, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/LocaleContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavItem, NavigationProps } from './types';
import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';
import ActionButtons from './ActionButtons';
import { useAuth } from '@/contexts/auth';

const Navigation: React.FC<NavigationProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const [isNavigating, setIsNavigating] = useState(false);
  const { isLoggedIn } = useAuth();
  
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
      path: '/transactions',
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
        navigate(isLoggedIn ? '/dashboard' : '/signin');
      }
      setTimeout(() => setIsNavigating(false), 400);
    }, 50);
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
        </div>
        
        <DesktopNavigation 
          navItems={navItems}
          handleNavigation={handleNavigation}
          isNavigating={isNavigating}
          isHomePage={isHomePage}
        />
        
        <ActionButtons 
          handleNavigation={handleNavigation}
          handleStarted={handleStarted}
          isNavigating={isNavigating}
          isHomePage={isHomePage}
        />
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
