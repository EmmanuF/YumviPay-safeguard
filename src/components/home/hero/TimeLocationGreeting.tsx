
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type GreetingType = {
  message: string;
  icon: React.ReactNode;
};

const TimeLocationGreeting: React.FC = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState<GreetingType>({
    message: "Hello",
    icon: <Sun className="w-4 h-4 text-amber-400" />
  });
  
  useEffect(() => {
    // Get current hour to determine appropriate greeting
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting({
        message: "Good morning",
        icon: <Sun className="w-4 h-4 text-amber-400" />
      });
    } else if (hour >= 12 && hour < 18) {
      setGreeting({
        message: "Good afternoon",
        icon: <Sun className="w-4 h-4 text-amber-500" />
      });
    } else {
      setGreeting({
        message: "Good evening",
        icon: <Moon className="w-4 h-4 text-indigo-300" />
      });
    }
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center text-sm font-medium"
    >
      <motion.div 
        className="flex items-center gap-1.5"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 15, 0, -15, 0],
            scale: [1, 1.2, 1, 1.2, 1]
          }}
          transition={{ 
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="bg-amber-50 p-1.5 rounded-full"
        >
          {greeting.icon}
        </motion.div>
        <span className="font-medium text-gray-800 bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
          {greeting.message}{user?.name ? `, ${user.name}` : ''}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default TimeLocationGreeting;
