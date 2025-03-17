
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import OfflineBanner from './OfflineBanner';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';
import BottomNavigation from './BottomNavigation';

interface MobileAppLayoutProps {
  children?: ReactNode;
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-gradient-to-b from-secondary-50 to-secondary-100/50">
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
      
      {!isHome && <BottomNavigation />}
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '0.75rem',
            background: 'rgba(255, 253, 231, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 240, 180, 0.3)',
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
