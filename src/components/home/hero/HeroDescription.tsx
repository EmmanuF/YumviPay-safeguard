
import React from 'react';
import { motion } from 'framer-motion';

const HeroDescription: React.FC = () => {
  return (
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="text-lg text-gray-600 mb-8 max-w-lg"
    >
      Send money to Africa with zero fees, better exchange rates, and lightning-fast transfers. Your loved ones receive funds directly to their mobile wallets or bank accounts.
    </motion.p>
  );
};

export default HeroDescription;
