
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const ExchangeRateIcon: React.FC = () => {
  return (
    <motion.div
      whileHover={{ 
        y: -2,
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      <TrendingUp className="h-6 w-6 text-primary-500" />
    </motion.div>
  );
};

export default ExchangeRateIcon;
