
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
  
  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`);
    if (path === '/profile') {
      console.log('Navigating to profile page');
    }
    navigate(path);
  };
  
  return (
    <nav className="container mx-auto flex items-center justify-between py-4 px-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary-600">Yumvi-Pay</h1>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
          >
            {item.name}
          </button>
        ))}
      </div>
      
      <div>
        <button
          onClick={onGetStarted}
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
