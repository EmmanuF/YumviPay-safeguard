
import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavItem as NavItemType } from './types';
import NavItem from './NavItem';

interface DesktopNavigationProps {
  navItems: NavItemType[];
  handleNavigation: (path: string) => void;
  isNavigating: boolean;
  isHomePage: boolean;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navItems,
  handleNavigation,
  isNavigating,
  isHomePage,
}) => {
  const location = useLocation();

  return (
    <div className="hidden md:flex items-center space-x-10">
      {navItems.slice(0, 3).map((item) => (
        <NavItem
          key={item.name}
          item={item}
          isActive={location.pathname === item.path}
          isHomePage={isHomePage}
          onClick={() => handleNavigation(item.path)}
          isNavigating={isNavigating}
        />
      ))}
    </div>
  );
};

export default DesktopNavigation;
