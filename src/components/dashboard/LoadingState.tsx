
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
        <p className="mt-4 text-foreground font-medium">Loading content...</p>
        <p className="mt-2 text-muted-foreground text-sm">Please wait while we fetch your data</p>
      </motion.div>
    </div>
  );
};

export default LoadingState;
