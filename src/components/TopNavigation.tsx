
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Clock, Users, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import LocaleSwitcher from './LocaleSwitcher';

const TopNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { t } = useLocale();
  const [isNavigating, setIsNavigating] = useState(false);
  const isMobile = useIsMobile();
  
  // Define paths where we don't want to show this navigation
  const hidePaths = ['/', '/signin', '/signup', '/forgot-password', '/reset-password'];
  const shouldHideNav = hidePaths.includes(location.pathname) || isMobile;
  
  // Return null if we should hide but maintain hooks consistency
  if (shouldHideNav) {
    return null;
  }
  
  const navItems = [
    { 
      path: '/', 
      label: t('nav.home'),
      requiresAuth: false 
    },
    { 
      path: '/send', 
      label: t('nav.send'),
      requiresAuth: true 
    },
    { 
      path: '/recipients', 
      label: t('nav.recipients'),
      requiresAuth: true 
    },
    {
      path: '/history',
      label: t('nav.history') || 'History',
      requiresAuth: true
    }
  ];
  
  const handleNavigation = (path: string) => {
    if (isNavigating || path === location.pathname) return;
    
    setIsNavigating(true);
    navigate(path);
    setTimeout(() => setIsNavigating(false), 500);
  };

  // Filter navItems based on authentication status
  const displayNavItems = navItems.filter(item => !item.requiresAuth || isLoggedIn);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-indigo-800 text-white py-3 z-50 relative shadow-md"
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* App Name/Logo */}
        <div className="flex items-center">
          <div 
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate('/')}
          >
            Yumvi-Pay
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-10">
          {displayNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "text-sm font-medium transition-colors px-3 py-1.5 rounded-md",
                location.pathname === item.path
                  ? "text-white font-semibold bg-white/10" 
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        {/* Right Side */}
        <div className="flex items-center space-x-5">
          <LocaleSwitcher />
          
          <button
            onClick={() => handleNavigation('/profile')}
            className="text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-white/10"
          >
            {t('nav.profile')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TopNavigation;
