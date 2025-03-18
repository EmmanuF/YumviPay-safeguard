
import React, { createContext, useState, useEffect } from 'react';
import { useNetworkStatus as useDeviceNetworkStatus } from '@/hooks/useNetworkStatus';
import { toast } from 'sonner';
import { NetworkContextType, NetworkProviderProps } from './types';
import { pausedRequests, loadOfflineMode, saveOfflineMode, processPausedRequests } from './networkUtils';

export const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const { isOnline, lastOnlineAt } = useDeviceNetworkStatus();
  const [isOffline, setIsOffline] = useState(!isOnline);
  const [offlineModeActive, setOfflineModeActive] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [pendingOperationsCount, setPendingOperationsCount] = useState(pausedRequests.length);
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlineSince, setOfflineSince] = useState<Date | null>(null);

  // Effect to handle network status changes
  useEffect(() => {
    setIsOffline(!isOnline);
    
    // If coming back online, notify the user
    if (isOnline && isOffline) {
      toast.info('Your connection has been restored');
      setOfflineSince(null);
      // Automatically attempt to sync if there are pending operations
      if (pausedRequests.length > 0 && !offlineModeActive) {
        syncOfflineData();
      }
    } else if (!isOnline && !isOffline) {
      toast.warning('You are now offline');
      setOfflineSince(new Date());
    }
    
    // Update pending operations count
    setPendingOperationsCount(pausedRequests.length);
  }, [isOnline, isOffline]);

  // Load offline status from storage on mount
  useEffect(() => {
    const initializeOfflineMode = async () => {
      const offlineMode = await loadOfflineMode();
      setOfflineModeActive(offlineMode);
      
      // If we start with pending requests, set initial pending count
      setPendingOperationsCount(pausedRequests.length);
    };

    initializeOfflineMode();
  }, []);

  // Save offline mode status when it changes
  useEffect(() => {
    saveOfflineMode(offlineModeActive);
  }, [offlineModeActive]);

  // Function to manually sync offline data
  const syncOfflineData = async (): Promise<boolean> => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return false;
    }
    
    if (pausedRequests.length === 0) {
      toast.info('No pending operations to sync');
      return true;
    }
    
    try {
      setIsSyncing(true);
      
      const { successCount, failureCount } = await processPausedRequests();
      
      // Update the pending operations count
      setPendingOperationsCount(pausedRequests.length);
      
      // Update last sync time
      const syncTime = new Date();
      setLastSyncTime(syncTime);
      
      // Show success/failure message
      if (failureCount === 0) {
        toast.success(`Successfully synced ${successCount} operations`);
      } else {
        toast.warning(`Synced ${successCount} operations, ${failureCount} failed`);
      }
      
      // If we're in offline mode but back online with successful sync, 
      // ask if the user wants to exit offline mode
      if (offlineModeActive && failureCount === 0) {
        const exitOfflineMode = window.confirm(
          'All operations have been synced. Do you want to exit offline mode?'
        );
        
        if (exitOfflineMode) {
          setOfflineModeActive(false);
        }
      }
      
      return failureCount === 0;
    } catch (error) {
      console.error('Error syncing offline data:', error);
      toast.error('Failed to sync offline data');
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // Function to toggle offline mode manually
  const toggleOfflineMode = () => {
    const newMode = !offlineModeActive;
    setOfflineModeActive(newMode);
    
    toast.info(newMode ? 'Offline mode activated' : 'Offline mode deactivated');
    
    // If turning off offline mode and we have pending requests, ask to sync
    if (!newMode && pausedRequests.length > 0 && isOnline) {
      const shouldSync = window.confirm(
        `You have ${pausedRequests.length} pending operations. Do you want to sync them now?`
      );
      
      if (shouldSync) {
        syncOfflineData();
      }
    }
  };

  // Function to add a request to the queue
  const addPausedRequest = (callback: () => Promise<any>) => {
    pausedRequests.push(callback);
    console.log(`Request added to queue. Total: ${pausedRequests.length}`);
    setPendingOperationsCount(pausedRequests.length);
  };

  return (
    <NetworkContext.Provider value={{ 
      isOffline, 
      isOnline, 
      addPausedRequest,
      offlineModeActive,
      toggleOfflineMode,
      syncOfflineData,
      lastSyncTime,
      pendingOperationsCount,
      isSyncing,
      offlineSince
    }}>
      {children}
    </NetworkContext.Provider>
  );
};
