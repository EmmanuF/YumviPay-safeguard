
import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface PersonalizedWelcomeProps {
  userName?: string;
}

const PersonalizedWelcome: React.FC<PersonalizedWelcomeProps> = ({ 
  userName = "Nana" // Default name for demonstration
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center font-medium"
    >
      <User className="w-4 h-4 mr-2 text-primary-500" />
      <span>Welcome back, {userName}</span>
    </motion.div>
  );
};

export default PersonalizedWelcome;
