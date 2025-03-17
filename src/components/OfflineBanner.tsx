
import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';
import { Button } from '@/components/ui/button';

export const OfflineBanner: React.FC = () => {
  const { isOffline, offlineModeActive, toggleOfflineMode } = useNetwork();
  
  // Show the banner if we're actually offline or if offline mode is manually activated
  const showBanner = isOffline || offlineModeActive;
  
  if (!showBanner) return null;
  
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-0 left-0 w-full bg-amber-500 text-white py-2 px-4 z-50 flex items-center justify-between"
    >
      <div className="flex items-center">
        <WifiOff className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">
          {isOffline 
            ? "You're offline. Some features may be limited." 
            : "Offline mode is active. Changes will sync when online."}
        </span>
      </div>
      {!isOffline && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-amber-600"
          onClick={toggleOfflineMode}
        >
          <Wifi className="h-4 w-4 mr-1" />
          Go Online
        </Button>
      )}
    </motion.div>
  );
};

export default OfflineBanner;
