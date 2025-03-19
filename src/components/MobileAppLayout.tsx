
import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import OfflineBanner from './OfflineBanner';
import Footer from './layout/Footer';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavigation from './BottomNavigation';
import { useNetwork } from '@/contexts/NetworkContext';
import { WifiOff } from 'lucide-react';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';
import { useAuth } from '@/contexts/AuthContext';
import { SignOutButton } from '@/components/authentication';

interface MobileAppLayoutProps {
  children?: ReactNode;
  hideFooter?: boolean;
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children, hideFooter = false }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { isOffline, offlineModeActive, pendingOperationsCount } = useNetwork();
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);
  const { isLoggedIn } = useAuth();
  
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
    ? 'bg-gradient-to-b from-navy-500/95 to-mint-300/90 border border-navy-500/50 shadow-lg'
    : 'glass-effect backdrop-blur-xl bg-gradient-to-b from-navy-500/90 to-mint-300/80 border border-navy-500/40 shadow-[0_8px_32px_rgba(10,37,64,0.2)]';
  
  return (
    <div className={`flex flex-col min-h-dvh ${getOptimizationClasses()}`}>
      {/* Diagonal top design - only shown on non-home pages */}
      {!isHome && (
        <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden z-0">
          <div className="absolute top-0 left-0 right-0 h-16 bg-navy-500 shadow-md"></div>
          <div className="absolute top-0 left-0 right-0 h-24">
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-navy-400 transform skew-y-6 origin-right shadow-sm"></div>
          </div>
        </div>
      )}
      
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
          className="z-10"
        >
          <Header />
        </motion.div>
      )}
      
      <main className="flex-1 relative z-10">
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
            className="w-full h-full pb-16" // Added bottom padding to account for the navigation bar
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Floating sign out button for all pages when logged in */}
      {isLoggedIn && location.pathname !== '/profile' && (
        <div className="fixed bottom-24 right-4 z-50">
          <SignOutButton 
            iconOnly 
            size="sm"
            className="rounded-full p-2 bg-primary-500 hover:bg-primary-600 text-black border-none shadow-lg"
          />
        </div>
      )}
      
      {/* Floating offline indicator that appears when scrolling */}
      <AnimatePresence>
        {showOfflineIndicator && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: animSettings.duration, type: "spring" }}
            className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-3 py-2 
                      ${glassEffectIntensity === 'light' ? 'bg-navy-400 border border-navy-300 shadow-md' : 'glass-effect bg-navy-400/95 backdrop-blur-md border border-navy-300/40 shadow-lg'} 
                      text-white rounded-full flex items-center space-x-2 z-40`}
          >
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Offline</span>
            {pendingOperationsCount > 0 && (
              <span className="bg-gray-300 text-navy-600 rounded-full px-1.5 text-xs font-semibold">
                {pendingOperationsCount}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isHome && <BottomNavigation />}
      
      {/* Footer */}
      {!hideFooter && <Footer />}
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '0.75rem',
            background: glassEffectIntensity === 'light' 
              ? 'rgba(242, 242, 242, 0.97)' 
              : 'rgba(242, 242, 242, 0.9)',
            backdropFilter: glassEffectIntensity === 'light' ? 'none' : 'blur(12px)',
            border: '1px solid rgba(10, 37, 64, 0.4)',
            boxShadow: '0 8px 32px -4px rgba(10, 37, 64, 0.2)',
            color: '#000000',
            fontWeight: '500'
          },
          className: 'glass-card',
        }}
      />
    </div>
  );
};

export default MobileAppLayout;
