
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRightCircle } from 'lucide-react';

const RecoveryState = () => {
  return (
    <motion.div 
      className="p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <ArrowRightCircle className="h-6 w-6 text-green-500" />
        </div>
        
        <h3 className="text-lg font-medium">Recovering transaction data...</h3>
        <p className="text-sm text-gray-600">
          We're recovering your transaction data from the latest backup.
          This will only take a moment.
        </p>
      </div>
    </motion.div>
  );
};

export default RecoveryState;
