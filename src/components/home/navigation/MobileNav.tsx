
import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NavItem } from './types';

interface MobileNavProps {
  navItems: NavItem[];
  handleNavigation: (path: string) => void;
  isNavigating: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ navItems, handleNavigation, isNavigating }) => {
  const location = useLocation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="glass-effect py-2 px-4 flex justify-around rounded-xl md:hidden mt-4 bg-gradient-to-b from-primary-400 to-primary-300 backdrop-blur-md border border-primary-300/30 shadow-sm"
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
                ? "text-accent-400 bg-primary-500/50" 
                : "text-white/80 hover:text-white hover:bg-primary-500/30",
              isNavigating && "opacity-75"
            )}
          >
            {item.icon}
          </div>
          <span className={cn(
            "text-xs mt-1 font-medium",
            location.pathname === item.path
              ? "text-accent-400"
              : "text-white/80"
          )}>
            {item.name}
          </span>
        </button>
      ))}
    </motion.div>
  );
};

export default MobileNav;
