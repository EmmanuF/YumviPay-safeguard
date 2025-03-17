
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus as useDeviceNetworkStatus } from '@/hooks/useNetworkStatus';
import { toast } from 'sonner';

type NetworkContextType = {
  isOffline: boolean;
  isOnline: boolean;
  addPausedRequest: (callback: () => Promise<any>) => void;
  offlineModeActive: boolean;
  toggleOfflineMode: () => void;
  syncOfflineData: () => Promise<boolean>;
  lastSyncTime: Date | null;
  pendingOperationsCount: number;
};

interface NetworkProviderProps {
  children: ReactNode;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

// Queue for storing requests to be executed when back online
const pausedRequests: (() => Promise<any>)[] = [];

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const { isOnline } = useDeviceNetworkStatus();
  const [isOffline, setIsOffline] = useState(!isOnline);
  const [offlineModeActive, setOfflineModeActive] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [pendingOperationsCount, setPendingOperationsCount] = useState(pausedRequests.length);

  useEffect(() => {
    setIsOffline(!isOnline);
    
    // If coming back online, notify the user
    if (isOnline && isOffline) {
      toast.info('Your connection has been restored');
    } else if (!isOnline && !isOffline) {
      toast.warning('You are now offline');
    }
    
    // Update pending operations count
    setPendingOperationsCount(pausedRequests.length);
  }, [isOnline, isOffline]);

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
      console.log(`Processing ${pausedRequests.length} queued requests`);
      toast.info(`Syncing ${pausedRequests.length} pending operations`);
      
      // Create a copy of the requests to process
      const requestsToProcess = [...pausedRequests];
      let successCount = 0;
      let failureCount = 0;
      
      // Process all paused requests
      for (const request of requestsToProcess) {
        try {
          await request();
          // Remove from queue after successful processing
          const index = pausedRequests.indexOf(request);
          if (index > -1) {
            pausedRequests.splice(index, 1);
          }
          successCount++;
        } catch (error) {
          console.error('Error processing queued request:', error);
          failureCount++;
        }
      }
      
      // Update the pending operations count
      setPendingOperationsCount(pausedRequests.length);
      
      // Update last sync time
      setLastSyncTime(new Date());
      
      // Show success/failure message
      if (failureCount === 0) {
        toast.success(`Successfully synced ${successCount} operations`);
      } else {
        toast.warning(`Synced ${successCount} operations, ${failureCount} failed`);
      }
      
      return failureCount === 0;
    } catch (error) {
      console.error('Error syncing offline data:', error);
      toast.error('Failed to sync offline data');
      return false;
    }
  };

  // Automatically sync when coming back online
  useEffect(() => {
    if (isOnline && pausedRequests.length > 0) {
      syncOfflineData();
    }
  }, [isOnline]);

  // Function to toggle offline mode manually
  const toggleOfflineMode = () => {
    setOfflineModeActive(!offlineModeActive);
    toast.info(!offlineModeActive ? 'Offline mode activated' : 'Offline mode deactivated');
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
      pendingOperationsCount
    }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
