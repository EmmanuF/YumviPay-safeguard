
import React from 'react';
import { motion } from 'framer-motion';
import { HeroCalculator } from './index';

const HeroDescription: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 max-w-lg mx-auto"
    >
      <HeroCalculator />
    </motion.div>
  );
};

export default HeroDescription;
