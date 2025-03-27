
import React from 'react';
import { motion } from 'framer-motion';

const TransparencyIcon: React.FC = () => {
  return (
    <motion.div
      whileHover={{ 
        y: -2,
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path 
          d="M12 16.01V15.99" 
          stroke="#4CD4A9" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.path 
          d="M12 12.01V7.99" 
          stroke="#4CD4A9" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <motion.path 
          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" 
          stroke="#4CD4A9" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          animate={{ 
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
};

export default TransparencyIcon;
