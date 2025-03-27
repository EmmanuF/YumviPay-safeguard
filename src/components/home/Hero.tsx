
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
  const [showWelcome, setShowWelcome] = useState(false);

  // Sequence the greetings with a delayed transition
  useEffect(() => {
    // Show location greeting first
    setShowGreeting(true);
    setShowWelcome(false);
    
    // After 5 seconds, transition to welcome message
    const greetingTimer = setTimeout(() => {
      setShowGreeting(false);
      
      // Small delay before showing welcome
      const welcomeTimer = setTimeout(() => {
        setShowWelcome(true);
      }, 500);
      
      return () => clearTimeout(welcomeTimer);
    }, 5000);
    
    // Repeat the sequence every 15 seconds
    const sequenceTimer = setInterval(() => {
      setShowWelcome(false);
      
      setTimeout(() => {
        setShowGreeting(true);
        
        // After 5 seconds, hide greeting and show welcome
        setTimeout(() => {
          setShowGreeting(false);
          
          setTimeout(() => {
            setShowWelcome(true);
          }, 500);
        }, 5000);
      }, 500);
    }, 15000);
    
    return () => {
      clearTimeout(greetingTimer);
      clearInterval(sequenceTimer);
    };
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
      
      {/* Animated greeting section with sequence animation */}
      <div className="relative h-16 mb-8">
        <AnimatePresence mode="wait">
          {showGreeting && (
            <motion.div 
              key="location-greeting"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.22, 1, 0.36, 1],
                type: "spring",
                stiffness: 100
              }}
              className="glass-effect absolute w-full max-w-md mx-auto left-0 right-0 p-3.5 rounded-xl shadow-lg text-center"
            >
              <motion.div 
                className="flex flex-col space-y-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <TimeLocationGreeting />
              </motion.div>
            </motion.div>
          )}
          
          {showWelcome && (
            <motion.div 
              key="welcome-greeting"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.22, 1, 0.36, 1],
                type: "spring",
                stiffness: 100
              }}
              className="glass-effect absolute w-full max-w-md mx-auto left-0 right-0 p-3.5 rounded-xl shadow-lg text-center"
            >
              <motion.div 
                className="flex flex-col space-y-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <PersonalizedWelcome />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex flex-col items-center relative z-10">
        {/* Hero content */}
        <HeroContent onGetStarted={handleGetStarted} />
      </div>
    </div>
  );
};

export default Hero;
