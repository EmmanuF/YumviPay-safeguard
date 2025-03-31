
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Don't render the button if we're not on the homepage
  if (!isHomePage) {
    return null;
  }
  
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
          className={`fixed ${isMobile ? 'bottom-20' : 'bottom-10'} left-1/2 transform -translate-x-1/2 z-50 
                    px-3 py-2 rounded-full shadow-lg bg-primary-500 text-white 
                    hover:bg-primary-600 transition-all duration-300 
                    focus:outline-none focus:ring-2 focus:ring-primary-300
                    hover:scale-110 active:scale-95 backdrop-blur-sm
                    flex items-center gap-2`}
        >
          <span className="text-xs font-medium">Back to top</span>
          <ChevronUp size={18} className="animate-bounce-subtle" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
