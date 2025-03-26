
import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const HeroTitle: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-6"
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
        <span className="text-indigo-600">Transfer Without Boundaries</span>
      </h1>
      
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
