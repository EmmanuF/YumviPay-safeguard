
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Send, Clock, User, UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

interface NavigationProps {
  onGetStarted?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  
  const navItems: NavItem[] = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
      path: '/dashboard',
    },
    {
      name: 'Send',
      icon: <Send className="w-5 h-5" />,
      path: '/send',
    },
    {
      name: 'Recipients',
      icon: <UserPlus className="w-5 h-5" />,
      path: '/recipients',
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
  
  // Handle direct navigation to prevent any issues
  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="glass-effect py-2 px-4 flex justify-between items-center rounded-xl"
    >
      <div className="flex items-center gap-4">
        {navItems.slice(0, 3).map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className="flex flex-col items-center justify-center relative"
          >
            <div 
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                "text-gray-500 hover:text-primary-400"
              )}
            >
              {item.icon}
            </div>
            <span className="text-xs mt-1 font-medium text-gray-500">
              {item.name}
            </span>
          </button>
        ))}
      </div>
      
      {onGetStarted && (
        <Button 
          onClick={onGetStarted}
          className="flex items-center gap-2"
          size="sm"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </Button>
      )}
      
      <div className="flex items-center gap-4">
        {navItems.slice(3).map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className="flex flex-col items-center justify-center relative"
          >
            <div 
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                "text-gray-500 hover:text-primary-400"
              )}
            >
              {item.icon}
            </div>
            <span className="text-xs mt-1 font-medium text-gray-500">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Navigation;
