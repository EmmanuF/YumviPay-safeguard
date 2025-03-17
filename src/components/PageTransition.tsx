
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
  const { shouldUseComplexAnimations, getOptimizedAnimationSettings } = useDeviceOptimizations();
  
  const animSettings = getOptimizedAnimationSettings();
  
  // Different animation variants based on device type
  const variants = {
    initial: {
      opacity: 0,
      y: isMobile ? 20 : 10, // Smaller shift on desktop for subtlety
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: animSettings.duration,
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smoother feel
        when: "beforeChildren",
        staggerChildren: shouldUseComplexAnimations ? 0.1 : 0.05
      }
    },
    exit: {
      opacity: 0,
      y: isMobile ? -10 : -5,
      scale: 0.98,
      transition: {
        duration: animSettings.duration * 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // More subtle variants for child animations
  const childVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: animSettings.duration,
        type: "spring",
        stiffness: animSettings.stiffness,
        damping: animSettings.damping
      }
    }
  };
  
  return (
    <motion.div
      key={location.pathname}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full h-full"
    >
      {shouldUseComplexAnimations ? (
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
