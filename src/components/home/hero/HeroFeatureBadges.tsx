
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
      <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium flex items-center border border-primary-200/50">
        <Zap size={16} className="mr-1 text-primary-500" />
        Fast & Secure
      </span>
      <span className="bg-accent-100 text-accent-600 px-3 py-1 rounded-full text-sm font-medium flex items-center border border-accent-200/50">
        <Shield size={16} className="mr-1 text-accent-500" />
        Free Transfers
      </span>
    </motion.div>
  );
};

export default HeroFeatureBadges;
