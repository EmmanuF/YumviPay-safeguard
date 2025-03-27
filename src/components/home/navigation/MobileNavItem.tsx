
import React from 'react';
import { cn } from '@/lib/utils';
import { NavItem as NavItemType } from './types';

interface MobileNavItemProps {
  item: NavItemType;
  isActive: boolean;
  onClick: () => void;
  isNavigating: boolean;
}

export const MobileNavItem: React.FC<MobileNavItemProps> = ({ 
  item, 
  isActive, 
  onClick, 
  isNavigating 
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center relative px-3"
      disabled={isNavigating}
    >
      <div 
        className={cn(
          "p-2.5 rounded-full transition-all duration-300",
          isActive 
            ? "text-primary-600 bg-primary-100/80 shadow-sm" 
            : "text-primary-500 hover:text-primary-600 hover:bg-primary-50/80",
          isNavigating && "opacity-75"
        )}
      >
        {item.icon}
      </div>
      <span className={cn(
        "text-xs mt-1 font-medium",
        isActive
          ? "text-primary-600"
          : "text-primary-500"
      )}>
        {item.name}
      </span>
    </button>
  );
};

export default MobileNavItem;
