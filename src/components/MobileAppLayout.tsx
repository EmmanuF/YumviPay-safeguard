
import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import OfflineBanner from './OfflineBanner';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavigation from './BottomNavigation';
import { useNetwork } from '@/contexts/NetworkContext';
import { AlertTriangle, WifiOff } from 'lucide-react';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';

interface MobileAppLayoutProps {
  children?: ReactNode;
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { isOffline, offlineModeActive, pendingOperationsCount } = useNetwork();
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);
  
  // Get device-specific optimizations
  const {
    getOptimizationClasses,
    getOptimizedAnimationSettings,
    glassEffectIntensity
  } = useDeviceOptimizations();
  
  // Optimized animation settings
  const animSettings = getOptimizedAnimationSettings();
  
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
  
  // Enhanced glass effects with different intensities
  const glassClass = glassEffectIntensity === 'light' 
    ? 'bg-gradient-to-b from-primary-100/90 to-primary-50/80 border border-white/40'
    : 'glass-effect backdrop-blur-xl bg-gradient-to-b from-primary-100/80 to-white/70 border border-white/30 shadow-[0_8px_32px_rgba(110,54,229,0.15)]';
  
  return (
    <div className={`flex flex-col h-dvh overflow-hidden ${glassClass} ${getOptimizationClasses()}`}>
      <OfflineBanner />
      
      {!isHome && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: animSettings.duration,
            type: "spring",
            stiffness: animSettings.stiffness,
            damping: animSettings.damping
          }}
        >
          <Header />
        </motion.div>
      )}
      
      <main className="flex-1 overflow-auto overscroll-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              duration: animSettings.duration * 1.2,
              type: "spring",
              stiffness: animSettings.stiffness * 0.9,
              damping: animSettings.damping
            }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Floating offline indicator that appears when scrolling */}
      <AnimatePresence>
        {showOfflineIndicator && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: animSettings.duration, type: "spring" }}
            className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-3 py-2 
                      ${glassEffectIntensity === 'light' ? 'bg-primary-300 border border-primary-200' : 'glass-effect bg-primary-300/90 backdrop-blur-md border border-primary-200/30 shadow-lg'} 
                      text-white rounded-full flex items-center space-x-2 z-40`}
          >
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Offline</span>
            {pendingOperationsCount > 0 && (
              <span className="bg-white text-primary-500 rounded-full px-1.5 text-xs font-medium">
                {pendingOperationsCount}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isHome && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.2,
            duration: animSettings.duration,
            type: "spring",
            stiffness: animSettings.stiffness,
            damping: animSettings.damping
          }}
        >
          <BottomNavigation />
        </motion.div>
      )}
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '0.75rem',
            background: glassEffectIntensity === 'light' 
              ? 'rgba(236, 224, 255, 0.95)' 
              : 'rgba(236, 224, 255, 0.85)',
            backdropFilter: glassEffectIntensity === 'light' ? 'none' : 'blur(12px)',
            border: '1px solid rgba(143, 91, 255, 0.3)',
            boxShadow: '0 8px 32px -4px rgba(110, 54, 229, 0.15)',
            color: '#333',
          },
          className: 'glass-card',
        }}
      />
    </div>
  );
};

export default MobileAppLayout;
