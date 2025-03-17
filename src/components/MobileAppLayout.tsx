
import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import OfflineBanner from './OfflineBanner';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavigation from './BottomNavigation';
import { useNetwork } from '@/contexts/NetworkContext';
import { AlertTriangle, WifiOff } from 'lucide-react';

interface MobileAppLayoutProps {
  children?: ReactNode;
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { isOffline, offlineModeActive, pendingOperationsCount } = useNetwork();
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);
  
  // Show offline indicator on scroll
  useEffect(() => {
    const handleScroll = () => {
      // If offline and scrolled down, show the indicator
      if ((isOffline || offlineModeActive) && window.scrollY > 100) {
        setShowOfflineIndicator(true);
      } else {
        setShowOfflineIndicator(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOffline, offlineModeActive]);
  
  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-gradient-to-b from-secondary-100 to-secondary-50/80">
      <OfflineBanner />
      
      {!isHome && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Header />
        </motion.div>
      )}
      
      <main className="flex-1 overflow-auto overscroll-none">
        {children}
      </main>
      
      {/* Floating offline indicator that appears when scrolling */}
      <AnimatePresence>
        {showOfflineIndicator && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-amber-500 text-white rounded-full shadow-lg flex items-center space-x-2 z-40"
          >
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Offline</span>
            {pendingOperationsCount > 0 && (
              <span className="bg-white text-amber-500 rounded-full px-1.5 text-xs font-medium">
                {pendingOperationsCount}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isHome && <BottomNavigation />}
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '0.75rem',
            background: 'rgba(255, 236, 179, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 183, 77, 0.3)',
            boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.1)',
            color: '#333',
          },
          className: 'glass-card',
        }}
      />
    </div>
  );
};

export default MobileAppLayout;
