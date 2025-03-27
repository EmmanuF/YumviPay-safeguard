
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { motion } from 'framer-motion';

const PersonalizedWelcome: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  
  return (
    <motion.div 
      className="text-center text-gray-700"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {isLoggedIn && user?.name ? (
        <span className="font-semibold text-lg">
          Welcome back, <span className="text-primary-600">{user.name}</span>!
        </span>
      ) : (
        <span className="font-medium text-base">
          Welcome to <span className="font-semibold text-gradient-primary">Yumvi-Pay</span>
        </span>
      )}
    </motion.div>
  );
};

export default PersonalizedWelcome;
