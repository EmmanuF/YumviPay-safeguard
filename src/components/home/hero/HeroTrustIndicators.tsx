
import React from 'react';
import { motion } from 'framer-motion';

const HeroTrustIndicators: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 flex items-center justify-start w-full"
    >
      <div className="flex">
        <img 
          src="https://randomuser.me/api/portraits/men/25.jpg" 
          alt="User" 
          className="w-10 h-10 rounded-full border-2 border-white shadow-md"
        />
        <img 
          src="https://randomuser.me/api/portraits/women/67.jpg" 
          alt="User" 
          className="w-10 h-10 rounded-full border-2 border-white shadow-md -ml-2"
        />
        <img 
          src="https://randomuser.me/api/portraits/women/90.jpg" 
          alt="User" 
          className="w-10 h-10 rounded-full border-2 border-white shadow-md -ml-2"
        />
      </div>
      <div className="ml-3">
        <div className="text-sm text-gray-500">Trusted by</div>
        <div className="text-sm font-semibold">10K+ users globally</div>
      </div>
      
      <motion.div 
        className="ml-4 bg-white/80 px-3 py-1 rounded-full shadow-sm flex items-center"
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <div className="flex items-center">
          <span className="text-amber-500">★</span>
          <span className="text-amber-500">★</span>
          <span className="text-amber-500">★</span>
          <span className="text-amber-500">★</span>
          <span className="text-amber-500">★</span>
        </div>
        <span className="text-xs font-medium ml-1">4.9/5</span>
      </motion.div>
    </motion.div>
  );
};

export default HeroTrustIndicators;
