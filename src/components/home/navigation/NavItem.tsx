
import React from 'react';
import { cn } from '@/lib/utils';
import { NavItem as NavItemType } from './types';

interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
  isHomePage: boolean;
  onClick: () => void;
  isNavigating: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ 
  item, 
  isActive, 
  isHomePage, 
  onClick, 
  isNavigating 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-sm font-medium transition-colors px-2 py-1.5 rounded-md",
        isHomePage
          ? (isActive 
            ? "text-primary-600 font-semibold bg-primary-50/50" 
            : "text-primary-500 hover:text-primary-600 hover:bg-primary-50/30")
          : (isActive 
            ? "text-white font-semibold bg-white/10" 
            : "text-white/80 hover:text-white hover:bg-white/10")
      )}
      disabled={isNavigating}
    >
      {item.name}
    </button>
  );
};

export default NavItem;
