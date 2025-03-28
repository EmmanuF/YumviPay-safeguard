
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
import { WifiOff } from 'lucide-react';
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
  const isProfilePage = location.pathname.includes('/profile');

  const hideBottomNav = isSendMoneyPage || isTransactionPage;

  const pageBackground = isSendMoneyPage 
    ? 'bg-gradient-to-br from-background via-background to-muted/30' 
    : 'bg-background';

  const contentPaddingClass = isMobile && isSendMoneyPage ? 'pb-24' : '';

  const hideHeader = isSendMoneyPage;

  // Don't show LocaleSwitcher in profile page since it's already in the header
  const shouldShowLocaleSwitcher = !isProfilePage;
  
  // This is a fix for the duplicate headers issue
  // We should only show one of TopNavigation or Header, not both
  const shouldShowTopNavigation = !isMobile && !isHomePage;
  const shouldShowHeader = showMobileHeader && !hideHeader && !shouldShowTopNavigation;

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
      {shouldShowTopNavigation && <TopNavigation />}
      
      <OfflineBanner />
      
      {shouldShowHeader && (
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
          <Header showNotification={shouldShowLocaleSwitcher} />
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
      
      {isMobile && !hideBottomNav && <BottomNavigation />}
      
      {!hideFooter && <div className="footer-glow relative mt-8"><Footer /></div>}
      
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
