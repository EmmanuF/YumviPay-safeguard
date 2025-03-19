
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Clock, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const navItems = [
    { path: '/dashboard', icon: <Home size={24} />, label: 'Home' },
    { path: '/send', icon: <Send size={24} />, label: 'Send' },
    { path: '/transactions', icon: <Clock size={24} />, label: 'History' },
    { path: '/profile', icon: <BarChart3 size={24} />, label: 'Profile' },
    { path: '/recipients', icon: <Users size={24} />, label: 'Recipients' },
  ];

  return (
    <div className="relative">
      {/* Diagonal background design with our primary and accent colors */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden z-10">
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-primary-500"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24">
          <div className="absolute top-0 left-0 right-0 h-14 bg-accent-400 transform -skew-y-6 origin-left"></div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around z-20">
        {navItems.map((item) => (
          <motion.div
            key={item.path}
            className={`flex flex-col items-center justify-center cursor-pointer p-2 rounded-lg z-30 ${
              isActive(item.path) ? 'text-white' : 'text-white/80 hover:text-white'
            }`}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo(item.path)}
          >
            <div className={`p-1 rounded-full ${isActive(item.path) ? 'bg-white/20' : ''}`}>
              {item.icon}
            </div>
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
