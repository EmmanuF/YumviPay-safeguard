
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { toast } from '@/hooks/use-toast';
import { QueryClient } from '@tanstack/react-query';

interface NetworkContextType {
  isOnline: boolean;
  isOffline: boolean;
  lastOnlineAt: Date | null;
  pausedRequests: Array<() => Promise<any>>;
  addPausedRequest: (request: () => Promise<any>) => void;
  executePausedRequests: () => Promise<void>;
  clearPausedRequests: () => void;
  syncInProgress: boolean;
  offlineModeActive: boolean;
  toggleOfflineMode: () => void;
}

export const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ 
  children, 
  queryClient 
}) => {
  const { isOnline, isOffline, lastOnlineAt, status } = useNetworkStatus();
  const [pausedRequests, setPausedRequests] = useState<Array<() => Promise<any>>>([]);
  const [wasOffline, setWasOffline] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [offlineModeActive, setOfflineModeActive] = useState(false);

  // Handle offline mode toggle (for testing or intentional offline usage)
  const toggleOfflineMode = () => {
    setOfflineModeActive(prev => !prev);
    
    if (!offlineModeActive) {
      toast({
        title: 'Offline Mode Enabled',
        description: 'App will work offline. Some features may be limited.',
      });
    } else {
      toast({
        title: 'Offline Mode Disabled',
        description: 'App will use network connection when available.',
      });
    }
  };

  // Handle online/offline transitions
  useEffect(() => {
    if (wasOffline && isOnline) {
      // We just came back online
      toast({
        title: 'Connected',
        description: 'Your internet connection has been restored.',
      });
      
      // Invalidate queries to refresh stale data
      queryClient.invalidateQueries();
      
      // Auto-execute paused requests
      if (pausedRequests.length > 0) {
        executePausedRequests();
      }
    } else if (isOffline && !wasOffline) {
      toast({
        title: 'You are offline',
        description: 'Some features may be limited. Data will sync when connection returns.',
        variant: 'destructive',
      });
      
      // Save current timestamp to localStorage for persistent offline detection
      try {
        localStorage.setItem('yumvi_last_offline', new Date().toISOString());
      } catch (e) {
        console.error('Could not save offline timestamp', e);
      }
    }
    
    setWasOffline(isOffline);
  }, [isOnline, isOffline, wasOffline, queryClient]);

  const addPausedRequest = (request: () => Promise<any>) => {
    console.log('Adding paused request to queue');
    setPausedRequests(prev => [...prev, request]);
    
    try {
      // Save request count to localStorage for persistence across sessions
      localStorage.setItem('yumvi_paused_requests_count', (pausedRequests.length + 1).toString());
    } catch (e) {
      console.error('Could not save paused request count', e);
    }
  };

  const executePausedRequests = async () => {
    if ((isOnline || !offlineModeActive) && pausedRequests.length > 0) {
      setSyncInProgress(true);
      
      toast({
        title: 'Syncing',
        description: `Executing ${pausedRequests.length} pending requests...`,
      });
      
      const requests = [...pausedRequests];
      setPausedRequests([]);
      
      try {
        localStorage.setItem('yumvi_paused_requests_count', '0');
        
        const results = await Promise.allSettled(requests.map(req => req()));
        
        // Count successful and failed requests
        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        if (failed > 0) {
          toast({
            title: 'Sync incomplete',
            description: `${succeeded} requests completed. ${failed} failed.`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Sync complete',
            description: 'All pending requests have been processed.',
          });
        }
      } catch (error) {
        console.error('Error executing paused requests:', error);
        
        toast({
          title: 'Sync error',
          description: 'Some requests failed to complete.',
          variant: 'destructive',
        });
      } finally {
        setSyncInProgress(false);
      }
    }
  };

  const clearPausedRequests = () => {
    setPausedRequests([]);
    try {
      localStorage.setItem('yumvi_paused_requests_count', '0');
    } catch (e) {
      console.error('Could not clear paused request count', e);
    }
  };

  // Check for pending requests on startup
  useEffect(() => {
    try {
      const count = parseInt(localStorage.getItem('yumvi_paused_requests_count') || '0', 10);
      if (count > 0) {
        toast({
          title: 'Pending Sync',
          description: `You have ${count} transactions waiting to sync.`,
        });
      }
    } catch (e) {
      console.error('Error checking paused requests count', e);
    }
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        isOffline: isOffline || offlineModeActive,
        lastOnlineAt,
        pausedRequests,
        addPausedRequest,
        executePausedRequests,
        clearPausedRequests,
        syncInProgress,
        offlineModeActive,
        toggleOfflineMode,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
