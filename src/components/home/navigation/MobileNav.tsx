
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, X, Send, 
  Home, Clock, User, 
  UserPlus, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { Button } from '@/components/ui/button';
import { NavItem } from './types';

interface MobileNavProps {
  navItems: NavItem[];
  handleNavigation: (path: string) => void;
  isNavigating: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  navItems, 
  handleNavigation, 
  isNavigating 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { t } = useLocale();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleNavClick = (path: string) => {
    handleNavigation(path);
    setIsOpen(false);
  };
  
  const handleSendMoney = () => {
    navigate('/send');
    setIsOpen(false);
  };
  
  return (
    <div className="lg:hidden">
      {/* Toggle button */}
      <button 
        onClick={toggleMenu}
        className="p-2 text-charcoal-600"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
      
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile menu panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white z-50 shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4">
              <button 
                onClick={toggleMenu}
                className="p-2 text-charcoal-500"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Send Money Button - Prominent at top */}
            <div className="px-6 py-4">
              <Button
                onClick={handleSendMoney}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl flex items-center justify-center gap-2"
                disabled={isNavigating}
              >
                <Send className="h-5 w-5" />
                Send Money
              </Button>
            </div>
            
            <nav className="px-6 py-4 flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <button 
                      onClick={() => handleNavClick(item.path)}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      disabled={isNavigating}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-primary-500">
                          {item.icon}
                        </span>
                        <span className="text-charcoal-600 font-medium">
                          {item.name}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="px-6 py-6 border-t">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  onClick={() => handleNavClick('/profile')}
                  className="w-full"
                >
                  {t('nav.profile')}
                </Button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => handleNavClick('/signin')}
                    className="w-full"
                  >
                    {t('auth.signin')}
                  </Button>
                  <Button
                    onClick={() => handleNavClick('/signup')}
                    className="w-full"
                  >
                    {t('auth.signup')}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;
