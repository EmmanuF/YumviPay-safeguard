
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <Loader2 className="h-10 w-10 text-primary-500 mx-auto animate-spin" />
        <p className="mt-4 text-foreground">Loading content...</p>
      </motion.div>
    </div>
  );
};

export default LoadingState;
