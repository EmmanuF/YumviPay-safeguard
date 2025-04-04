
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { shouldUseHeavyAnimations, getOptimizedAnimationSettings } = useDeviceOptimizations();
  
  const animSettings = getOptimizedAnimationSettings();
  
  // Enhanced animation variants with more premium feel
  const variants = {
    initial: {
      opacity: 0,
      y: isMobile ? 20 : 10, 
      scale: 0.98,
      filter: 'blur(8px)'
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: animSettings.duration * 1.2,
        ease: [0.22, 1, 0.36, 1], // Enhanced cubic bezier for smoother feel
        when: "beforeChildren",
        staggerChildren: shouldUseHeavyAnimations() ? 0.08 : 0.04
      }
    },
    exit: {
      opacity: 0,
      y: isMobile ? -10 : -5,
      scale: 0.98,
      filter: 'blur(4px)',
      transition: {
        duration: animSettings.duration * 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // Enhanced child variants for staggered animations
  const childVariants = {
    initial: { opacity: 0, y: 15, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: animSettings.duration * 1.2,
        type: "spring",
        stiffness: animSettings.stiffness,
        damping: animSettings.damping
      }
    }
  };
  
  // Add proper bottom padding based on device type to account for bottom navigation
  const paddingClass = isMobile ? "pb-20" : "pb-10";
  
  return (
    <motion.div
      key={location.pathname}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full h-full ${paddingClass}`}
    >
      {shouldUseHeavyAnimations() ? (
        <motion.div variants={childVariants}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
};

export default PageTransition;
