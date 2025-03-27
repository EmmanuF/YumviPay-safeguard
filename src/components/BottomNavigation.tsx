
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Clock, Users, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { t } = useLocale();
  const [isNavigating, setIsNavigating] = useState(false);
  const currentPath = location.pathname;

  const navItems = [
    { 
      path: isLoggedIn ? '/dashboard' : '/', 
      icon: <Home size={20} />, 
      label: t('nav.home'),
      requiresAuth: false 
    },
    { 
      path: '/send', 
      icon: <Send size={20} />, 
      label: t('nav.send'),
      requiresAuth: true 
    },
    { 
      path: '/transactions', 
      icon: <Clock size={20} />, 
      label: t('nav.history'),
      requiresAuth: true 
    },
    { 
      path: '/recipients', 
      icon: <Users size={20} />, 
      label: t('nav.recipients'),
      requiresAuth: true 
    },
    { 
      path: '/profile', 
      icon: <User size={20} />, 
      label: t('nav.profile'),
      requiresAuth: true 
    },
  ];

  const handleNavigation = (path: string) => {
    if (isNavigating || path === currentPath) return;
    
    setIsNavigating(true);
    
    // If the item requires authentication and user is not logged in, redirect to signin
    if (path !== '/' && !isLoggedIn) {
      navigate('/signin');
    } else {
      navigate(path);
    }
    
    setTimeout(() => setIsNavigating(false), 500);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard' && currentPath === '/') return true;
    return currentPath === path;
  };

  // Filter navItems based on authentication status
  const displayNavItems = navItems.filter(item => !item.requiresAuth || isLoggedIn);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        {/* Decorative background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-600 to-primary-500 shadow-lg"></div>
        
        {/* Navigation items */}
        <div className="relative flex items-center justify-around h-16 px-2">
          {displayNavItems.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2 rounded-lg",
                "transition-all duration-200",
                isNavigating && "pointer-events-none"
              )}
              whileTap={{ scale: 0.9 }}
            >
              <div className={cn(
                "p-2 rounded-full transition-all duration-300",
                isActive(item.path)
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white"
              )}>
                {item.icon}
                
                {/* Active indicator */}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </div>
              
              <span className={cn(
                "text-xs mt-0.5 font-medium",
                isActive(item.path)
                  ? "text-white"
                  : "text-white/70"
              )}>
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BottomNavigation;
