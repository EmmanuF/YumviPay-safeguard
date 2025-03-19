
import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavItem } from './types';

interface NavItemsProps {
  navItems: NavItem[];
  handleNavigation: (path: string) => void;
  isNavigating: boolean;
}

const NavItems: React.FC<NavItemsProps> = ({ navItems, handleNavigation, isNavigating }) => {
  const location = useLocation();
  
  return (
    <div className="hidden md:flex items-center space-x-8">
      {navItems.slice(0, 3).map((item) => (
        <button
          key={item.name}
          onClick={() => handleNavigation(item.path)}
          className={cn(
            "text-sm font-medium transition-colors",
            location.pathname === item.path 
              ? "text-accent-500 font-semibold" 
              : "text-white hover:text-accent-200"
          )}
          disabled={isNavigating}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default NavItems;
