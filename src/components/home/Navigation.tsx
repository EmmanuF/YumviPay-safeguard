
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Clock, User, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  
  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  const handleStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigate('/signin');
    }
  };
  
  return (
    <header className="px-4 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div 
            className="text-xl font-bold text-primary-600 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            Yumvi-Pay
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          {navItems.slice(0, 3).map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "text-sm font-medium transition-colors",
                location.pathname === item.path 
                  ? "text-primary-600" 
                  : "text-gray-600 hover:text-primary-500"
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/signin')}
            className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
          >
            Sign In
          </button>
          
          <button
            onClick={handleStarted}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Get Started
          </button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass-effect py-2 px-4 flex justify-around rounded-xl md:hidden mt-4"
      >
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className="flex flex-col items-center justify-center relative"
          >
            <div 
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                location.pathname === item.path 
                  ? "text-primary-500" 
                  : "text-gray-500 hover:text-primary-400"
              )}
            >
              {item.icon}
            </div>
            <span className="text-xs mt-1 font-medium text-gray-500">
              {item.name}
            </span>
          </button>
        ))}
      </motion.div>
    </header>
  );
};

export default Navigation;
