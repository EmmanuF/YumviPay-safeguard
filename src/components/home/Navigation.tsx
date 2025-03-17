
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Clock, User, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

interface NavigationProps {
  onGetStarted?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const [isNavigating, setIsNavigating] = useState(false);
  
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
        navigate(isLoggedIn ? '/dashboard' : '/signin');
      }
      setTimeout(() => setIsNavigating(false), 400);
    }, 50);
  };
  
  // Don't render this navigation on mobile as we'll use BottomNavigation
  if (isMobile) {
    return null;
  }
  
  return (
    <header className="px-4 py-2 relative z-30">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div 
            className="text-2xl font-bold text-primary-700 cursor-pointer" 
            onClick={() => !isNavigating && navigate('/')}
          >
            {t('app.name')}
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {navItems.slice(0, 3).map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === item.path 
                  ? "text-primary-600 font-semibold" 
                  : "text-gray-700 hover:text-primary-500"
              )}
              disabled={isNavigating}
            >
              {item.name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <LocaleSwitcher />
          
          {!isLoggedIn ? (
            <button
              onClick={() => handleNavigation('/signin')}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              disabled={isNavigating}
            >
              {t('auth.signin')}
            </button>
          ) : (
            <button
              onClick={() => handleNavigation('/profile')}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              disabled={isNavigating}
            >
              {t('nav.profile')}
            </button>
          )}
          
          <button
            onClick={handleStarted}
            className={cn(
              "bg-primary-500 hover:bg-primary-600 text-white font-medium px-5 py-2 rounded-full transition-colors text-sm",
              isNavigating && "opacity-75 pointer-events-none"
            )}
            disabled={isNavigating}
          >
            {isLoggedIn ? t('nav.dashboard') : t('auth.signup')}
          </button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass-effect py-2 px-4 flex justify-around rounded-xl md:hidden mt-4"
      >
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className="flex flex-col items-center justify-center relative"
            disabled={isNavigating}
          >
            <div 
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                location.pathname === item.path 
                  ? "text-primary-500" 
                  : "text-gray-500 hover:text-primary-400",
                isNavigating && "opacity-75"
              )}
            >
              {item.icon}
            </div>
            <span className="text-xs mt-1 font-medium text-gray-500">
              {item.name}
            </span>
          </button>
        ))}
      </motion.div>
    </header>
  );
};

export default Navigation;
