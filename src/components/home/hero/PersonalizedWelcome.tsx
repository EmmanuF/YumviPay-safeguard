
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
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20 
      }}
      className="flex items-center justify-center font-medium"
    >
      <motion.div
        whileHover={{ scale: 1.2, rotate: 15 }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
          repeatDelay: 2
        }}
        className="mr-2 bg-primary-50 p-1.5 rounded-full"
      >
        <User className="w-4 h-4 text-primary-500" />
      </motion.div>
      <motion.span
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ 
          duration: 5, 
          ease: "easeInOut", 
          repeat: Infinity 
        }}
        style={{
          backgroundImage: "linear-gradient(90deg, #8B5CF6, #9f75ff, #8B5CF6)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          backgroundSize: "200% 100%"
        }}
        className="text-lg font-semibold"
      >
        Welcome back, {displayName}
      </motion.span>
    </motion.div>
  );
};

export default PersonalizedWelcome;
