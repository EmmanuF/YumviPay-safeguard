
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Zap, Shield } from 'lucide-react';

const HeroTitle: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-6"
    >
      <div className="flex flex-col">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          <span className="text-indigo-600">Transfer Without Boundaries</span>
        </h1>
        
        <div className="flex justify-end mt-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2"
          >
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-sm">
              <Zap size={16} className="mr-1" />
              Fast & Secure
            </span>
            <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-sm">
              <Shield size={16} className="mr-1" />
              Free Transfers
            </span>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="absolute -top-5 -right-5 text-indigo-200 rotate-12 opacity-30"
        animate={{ rotate: [12, 5, 12], scale: [1, 1.05, 1] }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <Globe size={64} />
      </motion.div>
    </motion.div>
  );
};

export default HeroTitle;
