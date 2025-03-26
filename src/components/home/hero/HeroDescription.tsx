
import React from 'react';
import { motion } from 'framer-motion';

const HeroDescription: React.FC = () => {
  // Get user's local time to display appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Get user's country - in a real app, this would use geolocation
  const country = "United States of America";
  
  return (
    <>
      <motion.p 
        initial={{
          opacity: 0,
          y: 20
        }} 
        animate={{
          opacity: 1,
          y: 0
        }} 
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1]
        }} 
        className="text-md md:text-lg text-white/90 mb-2 mt-4"
      >
        {getGreeting()} from {country} 👋
      </motion.p>
      
      <motion.h1
        initial={{
          opacity: 0,
          y: 20
        }} 
        animate={{
          opacity: 1,
          y: 0
        }} 
        transition={{
          duration: 0.7,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1]
        }} 
        className="text-4xl md:text-6xl font-bold text-white mb-8 mt-2"
      >
        Transfer Without Boundaries
      </motion.h1>
    </>
  );
};

export default HeroDescription;
