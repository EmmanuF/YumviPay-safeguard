
import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const SecureKycIcon: React.FC = () => {
  return (
    <motion.div
      whileHover={{ 
        y: -2,
        transition: { type: "spring", stiffness: 300 }
      }}
      animate={{ 
        scale: [1, 1.05, 1],
      }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
    >
      <Shield className="h-6 w-6 text-amber-500" />
    </motion.div>
  );
};

export default SecureKycIcon;
