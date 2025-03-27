
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroContent } from './hero';
import HeroBackground from './HeroBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeLocationGreeting, PersonalizedWelcome } from './hero';

interface HeroProps {
  onGetStarted?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const [showGreeting, setShowGreeting] = useState(true);

  // Toggle visibility of greeting every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowGreeting(prev => !prev);
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted(); // Use the provided callback if available
    } else {
      navigate('/onboarding'); // Direct navigation otherwise
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <HeroBackground />
      </div>
      
      {/* Animated greeting at the top - enhanced with better styling */}
      <AnimatePresence mode="wait">
        {showGreeting && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1],
              type: "spring",
              stiffness: 100
            }}
            className="glass-effect max-w-md mx-auto mb-8 p-3.5 rounded-xl shadow-lg text-center"
          >
            <motion.div 
              className="flex flex-col space-y-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <TimeLocationGreeting />
              <PersonalizedWelcome />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-col items-center relative z-10">
        {/* Hero content */}
        <HeroContent onGetStarted={handleGetStarted} />
      </div>
    </div>
  );
};

export default Hero;
