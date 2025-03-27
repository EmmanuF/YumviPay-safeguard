
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  
  // Show button when user scrolls down 300px
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  
  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className={`fixed ${isMobile ? 'bottom-20' : 'bottom-6'} right-6 z-50 
                    p-2 rounded-full shadow-lg bg-primary-500 text-white 
                    hover:bg-primary-600 transition-all duration-300 
                    focus:outline-none focus:ring-2 focus:ring-primary-300
                    hover:scale-110 active:scale-95 backdrop-blur-sm`}
        >
          <ChevronUp size={24} className="animate-bounce-subtle" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
