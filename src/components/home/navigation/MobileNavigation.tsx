
import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NavItem as NavItemType } from './types';
import { MobileNavItem } from './MobileNavItem';

interface MobileNavigationProps {
  navItems: NavItemType[];
  handleNavigation: (path: string) => void;
  isNavigating: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  navItems,
  handleNavigation,
  isNavigating,
}) => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="glass-effect py-3 px-5 flex justify-around rounded-xl md:hidden mt-5 bg-gradient-to-b from-primary-50/90 to-white/80 backdrop-blur-md border border-primary-100/30 shadow-lg"
    >
      {navItems.map((item) => (
        <MobileNavItem
          key={item.name}
          item={item}
          isActive={location.pathname === item.path}
          onClick={() => handleNavigation(item.path)}
          isNavigating={isNavigating}
        />
      ))}
    </motion.div>
  );
};

export default MobileNavigation;
