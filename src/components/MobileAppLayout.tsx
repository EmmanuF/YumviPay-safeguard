
import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import OfflineBanner from './OfflineBanner';
import Footer from './layout/Footer';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavigation from './BottomNavigation';
import TopNavigation from './TopNavigation';
import { useNetwork } from '@/contexts/NetworkContext';
import { AlertTriangle, WifiOff } from 'lucide-react';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';
import { useIsMobile } from '@/hooks/use-mobile';
import ScrollToTopButton from './ScrollToTopButton';

interface MobileAppLayoutProps {
  children?: ReactNode;
  hideFooter?: boolean;
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children, hideFooter = false }) => {
  const location = useLocation();
  const { isOffline, offlineModeActive, pendingOperationsCount } = useNetwork();
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    getOptimizationClasses,
    getOptimizedAnimationSettings,
    glassEffectIntensity
  } = useDeviceOptimizations();
  
  const animSettings = getOptimizedAnimationSettings();
  
  useEffect(() => {
    const handleScroll = () => {
      if ((isOffline || offlineModeActive) && window.scrollY > 100) {
        setShowOfflineIndicator(true);
      } else {
        setShowOfflineIndicator(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOffline, offlineModeActive]);
  
  const glassClass = glassEffectIntensity === 'light' 
    ? 'bg-gradient-to-b from-primary-100/90 to-primary-50/80 border border-white/40'
    : 'glass-effect backdrop-blur-xl bg-gradient-to-b from-primary-100/80 to-white/70 border border-white/30 shadow-[0_8px_32px_rgba(110,54,229,0.15)]';
  
  const isHomePage = location.pathname === '/';
  const showMobileHeader = isMobile && !isHomePage;
  
  const isSendMoneyPage = location.pathname.includes('/send');
  const isTransactionPage = location.pathname.includes('/transaction');

  // Don't show bottom nav on send money pages and transaction pages
  const hideBottomNav = isSendMoneyPage || isTransactionPage;

  const pageBackground = isSendMoneyPage 
    ? 'bg-gradient-to-br from-background via-background to-muted/30' 
    : 'bg-background';

  // Add extra padding at the bottom for pages that need fixed buttons on mobile
  const contentPaddingClass = isMobile && isSendMoneyPage ? 'pb-24' : '';

  // Don't show the header on send money pages (since we now have a fixed progress bar)
  const hideHeader = isSendMoneyPage;

  // Page transition variants
  const pageVariants = {
    initial: { 
      opacity: 0, 
      x: isMobile ? 10 : 0, 
      scale: 0.98 
    },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0, 
      x: isMobile ? -10 : 0, 
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className={`flex flex-col min-h-dvh ${getOptimizationClasses()} ${pageBackground} ${contentPaddingClass}`}>
      <TopNavigation />
      
      {showMobileHeader && !hideHeader && (
        <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden z-0">
          <div className="absolute top-0 left-0 right-0 h-16 bg-primary-600">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400/30 via-primary-400 to-primary-400/30"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-primary-400/20"></div>
            <div className="absolute top-4 right-10 w-16 h-16 rounded-full bg-primary-400/10"></div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-24">
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-primary-500 transform skew-y-6 origin-right"></div>
          </div>
        </div>
      )}
      
      <OfflineBanner />
      
      {showMobileHeader && !hideHeader && (
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
      
      <main className={`flex-1 relative z-10 ${isMobile && !hideBottomNav ? 'pb-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <ScrollToTopButton />
      
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
      
      {!hideBottomNav && <BottomNavigation />}
      
      {!hideFooter && <Footer />}
      
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
