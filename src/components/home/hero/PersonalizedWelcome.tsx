
import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PersonalizedWelcomeProps {
  userName?: string;
}

const PersonalizedWelcome: React.FC<PersonalizedWelcomeProps> = ({ 
  userName // Optional prop for testing/override
}) => {
  const { user } = useAuth();
  
  // Use auth context for the name, fallback to prop or generic greeting
  const displayName = userName || (user?.name) || 'there';
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center font-medium"
    >
      <User className="w-4 h-4 mr-2 text-primary-500" />
      <span>Welcome back, {displayName}</span>
    </motion.div>
  );
};

export default PersonalizedWelcome;
