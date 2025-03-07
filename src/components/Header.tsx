
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showNotification?: boolean;
  transparent?: boolean;
  className?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showNotification = false,
  transparent = false,
  className,
  onMenuClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const goBack = () => {
    if (location.pathname === '/') {
      return;
    }
    navigate(-1);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'w-full py-4 px-4 flex items-center justify-between',
        transparent ? 'bg-transparent' : 'bg-background',
        className
      )}
    >
      <div className="flex items-center">
        {showBackButton ? (
          <button 
            onClick={goBack}
            className="mr-2 p-2 rounded-full hover:bg-primary-100/50 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-primary-500" />
          </button>
        ) : onMenuClick ? (
          <button 
            onClick={onMenuClick}
            className="mr-2 p-2 rounded-full hover:bg-primary-100/50 transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-primary-500" />
          </button>
        ) : null}
        
        {title && (
          <h1 className="text-lg font-medium text-foreground">{title}</h1>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {showNotification && (
          <button 
            className="p-2 rounded-full hover:bg-primary-100/50 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-primary-500" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary-400"></span>
          </button>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
