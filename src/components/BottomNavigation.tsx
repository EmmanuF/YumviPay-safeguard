
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems: NavItem[] = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      path: '/',
    },
    {
      name: 'Send',
      icon: <Send className="w-5 h-5" />,
      path: '/send',
    },
    {
      name: 'History',
      icon: <Clock className="w-5 h-5" />,
      path: '/history',
    },
    {
      name: 'Profile',
      icon: <User className="w-5 h-5" />,
      path: '/profile',
    },
  ];
  
  const handleNavigation = (path: string) => {
    console.log(`BottomNav: Navigating to ${path}`);
    navigate(path);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="fixed bottom-0 left-0 right-0 z-10 glass-effect py-2 px-4 flex justify-around"
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className="flex flex-col items-center justify-center relative"
          >
            <div 
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                isActive 
                  ? "text-primary-500 bg-primary-100/50" 
                  : "text-gray-500 hover:text-primary-400"
              )}
            >
              {item.icon}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary-500 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{ translateX: "-50%" }}
                />
              )}
            </div>
            <span 
              className={cn(
                "text-xs mt-1 font-medium",
                isActive ? "text-primary-500" : "text-gray-500"
              )}
            >
              {item.name}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
};

export default BottomNavigation;
