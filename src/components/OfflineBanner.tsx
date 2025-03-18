
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RotateCw, Clock, AlertTriangle } from 'lucide-react';
import { useNetwork } from '@/contexts/network';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Progress } from '@/components/ui/progress';

export const OfflineBanner: React.FC = () => {
  const { 
    isOffline, 
    offlineModeActive, 
    toggleOfflineMode, 
    pendingOperationsCount, 
    syncOfflineData,
    isSyncing,
    offlineSince
  } = useNetwork();
  
  // Show the banner if we're actually offline or if offline mode is manually activated
  const showBanner = isOffline || offlineModeActive;
  
  // Format time offline if available
  const offlineTimeDisplay = offlineSince 
    ? formatDistanceToNow(offlineSince, { addSuffix: true })
    : '';
  
  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 w-full bg-primary-400 text-white py-2 px-4 z-50 flex flex-col"
        >
          <div className="flex items-center justify-between">
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
                className="text-white hover:bg-primary-500"
                onClick={toggleOfflineMode}
              >
                <Wifi className="h-4 w-4 mr-1" />
                Go Online
              </Button>
            )}
          </div>
          
          {/* Additional offline information */}
          {(isOffline || offlineModeActive) && (
            <div className="mt-1 flex flex-wrap items-center justify-between text-xs">
              {offlineSince && (
                <div className="flex items-center mr-4">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Offline {offlineTimeDisplay}</span>
                </div>
              )}
              
              {pendingOperationsCount > 0 && (
                <div className="flex flex-col w-full mt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      <span>
                        {pendingOperationsCount} {pendingOperationsCount === 1 ? 'operation' : 'operations'} pending
                      </span>
                    </div>
                    
                    {!isOffline && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white text-xs py-1 px-2 h-auto hover:bg-primary-500"
                        onClick={syncOfflineData}
                        disabled={isSyncing}
                      >
                        {isSyncing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="mr-1"
                            >
                              <RotateCw className="h-3 w-3" />
                            </motion.div>
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RotateCw className="h-3 w-3 mr-1" />
                            Sync Now
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  
                  {isSyncing && (
                    <Progress value={45} className="h-1 bg-primary-300" />
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
