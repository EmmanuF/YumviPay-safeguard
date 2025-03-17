
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ExchangeRateCalculator from '@/components/ExchangeRateCalculator';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const HeroCalculator: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      <motion.div
        variants={itemVariants}
        className="absolute inset-0 bg-gradient-to-br from-primary-100/30 to-transparent rounded-2xl transform rotate-3 scale-[1.02] shadow-xl opacity-60 backdrop-blur-sm"
      />
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-300 rounded-full opacity-70 z-0"
        animate={{ 
          y: [0, -8, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary-300 rounded-full opacity-70 z-0"
        animate={{ 
          y: [0, 8, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 4,
          delay: 1,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div
        variants={itemVariants}
        className="relative z-10 glass-strong rounded-2xl transform"
        whileHover={{ scale: 1.02, rotate: [-1, 1, 0], transition: { duration: 0.5 } }}
      >
        <ExchangeRateCalculator />
        
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-gray-500 text-sm cursor-pointer"
          whileHover={{ y: 2 }}
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>See more rates</span>
          <ChevronDown size={14} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroCalculator;
