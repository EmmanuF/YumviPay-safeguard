
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Users, History, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    // Handle both /history and /transactions paths for the history tab
    if ((path === '/history' || path === '/transactions') && 
        (location.pathname === '/history' || location.pathname === '/transactions')) {
      return true;
    }
    // Consider root path as history for authenticated users
    if (path === '/history' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };
  
  const navigationItems = [
    { path: '/history', icon: Home, label: 'Home' },
    { path: '/send', icon: Send, label: 'Send' },
    { path: '/recipients', icon: Users, label: 'Recipients' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50">
      <div className="flex justify-between items-center px-2">
        {navigationItems.map((item) => {
          const isActiveItem = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <button
              key={item.path + item.label}
              className={`flex flex-col items-center justify-center py-2 px-3 w-1/5 transition-colors ${
                isActiveItem ? 'text-primary' : 'text-gray-500 hover:text-primary-600'
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className={`h-6 w-6 ${isActiveItem ? 'text-primary-600' : 'text-gray-500'}`} />
              <span className={`text-xs mt-1 ${isActiveItem ? 'font-medium text-primary-700' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
