
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus as useDeviceNetworkStatus } from '@/hooks/useNetworkStatus';
import { toast } from 'sonner';
import { clearApiCache } from '@/services/api/cache';

type NetworkContextType = {
  isOffline: boolean;
  isOnline: boolean;
  addPausedRequest: (callback: () => Promise<any>) => void;
  offlineModeActive: boolean;
  toggleOfflineMode: () => void;
  syncOfflineData: () => Promise<boolean>;
  lastSyncTime: Date | null;
  pendingOperationsCount: number;
  isSyncing: boolean;
  offlineSince: Date | null;
};

interface NetworkProviderProps {
  children: ReactNode;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

// Queue for storing requests to be executed when back online
const pausedRequests: (() => Promise<any>)[] = [];

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
    const loadOfflineMode = async () => {
      try {
        const { Preferences } = await import('@capacitor/preferences');
        const { value } = await Preferences.get({ key: 'offlineModeActive' });
        if (value) {
          setOfflineModeActive(value === 'true');
        }
      } catch (error) {
        console.error('Failed to load offline mode status:', error);
      }
    };

    loadOfflineMode();

    // If we start with pending requests, set initial pending count
    setPendingOperationsCount(pausedRequests.length);
  }, []);

  // Save offline mode status when it changes
  useEffect(() => {
    const saveOfflineMode = async () => {
      try {
        const { Preferences } = await import('@capacitor/preferences');
        await Preferences.set({
          key: 'offlineModeActive',
          value: offlineModeActive.toString(),
        });
      } catch (error) {
        console.error('Failed to save offline mode status:', error);
      }
    };

    saveOfflineMode();
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
      console.log(`Processing ${pausedRequests.length} queued requests`);
      toast.info(`Syncing ${pausedRequests.length} pending operations`);
      
      setIsSyncing(true);
      
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
      const syncTime = new Date();
      setLastSyncTime(syncTime);
      
      // Clear API cache to ensure fresh data on next fetch
      await clearApiCache();
      
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

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
