
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Clock, User, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavigationProps, NavItem } from './types';
import NavItems from './NavItems';
import NavActions from './NavActions';
import MobileNav from './MobileNav';

const Navigation: React.FC<NavigationProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const isAdmin = isLoggedIn && user?.email?.endsWith('@yumvi-pay.com');
  
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
  
  if (isMobile) {
    return null;
  }
  
  return (
    <header className="px-4 py-2 relative z-30">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div 
            className="text-2xl font-bold text-white cursor-pointer" 
            onClick={() => !isNavigating && navigate('/')}
          >
            {t('app.name')}
          </div>
        </div>
        
        <NavItems 
          navItems={navItems} 
          handleNavigation={handleNavigation} 
          isNavigating={isNavigating} 
        />
        
        <NavActions 
          handleNavigation={handleNavigation} 
          handleStarted={handleStarted} 
          isNavigating={isNavigating}
          isAdmin={isAdmin}
        />
      </div>
      
      <MobileNav 
        navItems={navItems} 
        handleNavigation={handleNavigation} 
        isNavigating={isNavigating} 
      />
    </header>
  );
};

export default Navigation;
