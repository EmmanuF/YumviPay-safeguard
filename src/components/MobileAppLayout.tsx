
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import OfflineBanner from './OfflineBanner';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileAppLayoutProps {
  children?: ReactNode;
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-gradient-to-b from-background to-gray-50/50">
      <AnimatePresence>
        <OfflineBanner />
      </AnimatePresence>
      
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
        <AnimatePresence mode="wait">
          {children || <Outlet />}
        </AnimatePresence>
      </main>
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '0.75rem',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
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
