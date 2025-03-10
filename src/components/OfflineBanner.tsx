
import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';

export const OfflineBanner: React.FC = () => {
  const { isOffline } = useNetwork();
  
  if (!isOffline) return null;
  
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-0 left-0 w-full bg-amber-500 text-white py-2 px-4 z-50 flex items-center justify-center"
    >
      <WifiOff className="h-4 w-4 mr-2" />
      <span className="text-sm font-medium">You're offline. Some features may be limited.</span>
    </motion.div>
  );
};

export default OfflineBanner;
