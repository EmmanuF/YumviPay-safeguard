
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import ExchangeRateCalculatorStub from '@/components/home/ExchangeRateCalculatorStub';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';

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
  const { shouldUseComplexAnimations } = useDeviceOptimizations();
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Enhanced background elements with gradients */}
      <motion.div
        variants={itemVariants}
        className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 to-secondary-100/30 rounded-2xl transform rotate-3 scale-[1.02] shadow-xl opacity-70"
      />
      <motion.div 
        variants={itemVariants}
        className="absolute inset-0 bg-gradient-to-tr from-indigo-50/20 to-secondary-200/20 rounded-2xl transform -rotate-1 scale-[1.01] opacity-60"
      />
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute -top-6 -left-6 w-12 h-12 bg-indigo-300 rounded-full opacity-70 z-0"
        animate={{ 
          y: [0, -8, 0],
          scale: [1, 1.05, 1],
          rotate: shouldUseComplexAnimations ? [0, 5, 0] : 0,
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute top-1/4 -right-3 w-8 h-8 bg-primary-400 rounded-full opacity-60 z-0"
        animate={{ 
          x: [0, 5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 2.5,
          delay: 0.5,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute -bottom-4 -right-4 w-16 h-16 bg-secondary-300 rounded-full opacity-70 z-0"
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

      {/* Sparkle elements */}
      {shouldUseComplexAnimations && (
        <>
          <motion.div
            className="absolute top-10 right-20 z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="text-primary-400 h-6 w-6" />
          </motion.div>
          
          <motion.div
            className="absolute top-3/4 left-6 z-10"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2.5,
              delay: 0.7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <TrendingUp className="text-indigo-500 h-5 w-5" />
          </motion.div>
        </>
      )}
      
      <motion.div
        variants={itemVariants}
        className="relative z-10 bg-white rounded-2xl shadow-lg"
        whileHover={{ 
          scale: 1.01, 
          transition: { duration: 0.3 } 
        }}
      >
        <ExchangeRateCalculatorStub />
        
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-gray-500 text-sm cursor-pointer group"
          whileHover={{ y: 2 }}
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="group-hover:text-indigo-600 transition-colors">See more rates</span>
          <ChevronDown size={14} className="group-hover:text-indigo-600 transition-colors" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroCalculator;
