
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Clock, Users, BarChart3 } from 'lucide-react';

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
    { path: '/history', icon: <Clock size={24} />, label: 'History' },
    { path: '/analytics', icon: <BarChart3 size={24} />, label: 'Analytics' },
    { path: '/recipients', icon: <Users size={24} />, label: 'Recipients' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around shadow-sm z-20">
      {navItems.map((item) => (
        <div
          key={item.path}
          className={`flex flex-col items-center justify-center w-full h-full cursor-pointer ${
            isActive(item.path) ? 'text-primary' : 'text-gray-500'
          }`}
          onClick={() => navigateTo(item.path)}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomNavigation;
