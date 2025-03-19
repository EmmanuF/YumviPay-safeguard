
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield } from 'lucide-react';

const HeroFeatureBadges: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-2 mb-3"
    >
      <span className="bg-primary-700/30 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center border border-primary-600/50">
        <Zap size={16} className="mr-1 text-accent" />
        Fast & Secure
      </span>
      <span className="bg-primary-700/30 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center border border-secondary/50">
        <Shield size={16} className="mr-1 text-secondary" />
        Free Transfers
      </span>
    </motion.div>
  );
};

export default HeroFeatureBadges;
