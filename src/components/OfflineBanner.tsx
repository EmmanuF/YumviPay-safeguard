
import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';

const OfflineBanner = () => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground p-2 text-center flex items-center justify-center"
    >
      <WifiOff className="w-4 h-4 mr-2" />
      <span className="text-sm font-medium">You are currently offline. Some features may be unavailable.</span>
    </motion.div>
  );
};

export default OfflineBanner;
