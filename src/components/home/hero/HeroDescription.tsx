
import React from 'react';
import { motion } from 'framer-motion';
import { HeroCalculator, HeroFeatureBullets, HeroTrustIndicators } from './index';

const HeroDescription: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      <HeroCalculator />
      <div className="mt-6">
        <HeroFeatureBullets />
        <HeroTrustIndicators />
      </div>
    </motion.div>
  );
};

export default HeroDescription;
