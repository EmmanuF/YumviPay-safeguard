
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Clock, User, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';
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
  
  // Only show on mobile for home page
  if (isMobile && location.pathname !== '/') {
    return null;
  }
  
  // On homepage, show responsively based on design
  // On other pages, only show on desktop (not mobile)
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
        
        <div className="hidden md:flex items-center space-x-10">
          {navItems.slice(0, 3).map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "text-sm font-medium transition-colors px-2 py-1.5 rounded-md",
                isHomePage
                  ? (location.pathname === item.path 
                    ? "text-primary-600 font-semibold bg-primary-50/50" 
                    : "text-primary-500 hover:text-primary-600 hover:bg-primary-50/30")
                  : (location.pathname === item.path 
                    ? "text-white font-semibold bg-white/10" 
                    : "text-white/80 hover:text-white hover:bg-white/10")
              )}
              disabled={isNavigating}
            >
              {item.name}
            </button>
          ))}
        </div>
        
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
      </div>
      
      {/* Mobile navigation for home page - enhanced with better spacing and visual depth */}
      {isHomePage && isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-effect py-3 px-5 flex justify-around rounded-xl md:hidden mt-5 bg-gradient-to-b from-primary-50/90 to-white/80 backdrop-blur-md border border-primary-100/30 shadow-lg"
        >
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center justify-center relative px-3"
              disabled={isNavigating}
            >
              <div 
                className={cn(
                  "p-2.5 rounded-full transition-all duration-300",
                  location.pathname === item.path 
                    ? "text-primary-600 bg-primary-100/80 shadow-sm" 
                    : "text-primary-500 hover:text-primary-600 hover:bg-primary-50/80",
                  isNavigating && "opacity-75"
                )}
              >
                {item.icon}
              </div>
              <span className={cn(
                "text-xs mt-1 font-medium",
                location.pathname === item.path
                  ? "text-primary-600"
                  : "text-primary-500"
              )}>
                {item.name}
              </span>
            </button>
          ))}
        </motion.div>
      )}
    </header>
  );
};

export default Navigation;
