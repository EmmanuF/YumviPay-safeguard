
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
    } else if (isOffline) {
      toast({
        title: 'You are offline',
        description: 'Some features may be limited.',
        variant: 'destructive',
      });
    }
    
    setWasOffline(isOffline);
  }, [isOnline, isOffline, wasOffline, queryClient]);

  const addPausedRequest = (request: () => Promise<any>) => {
    setPausedRequests(prev => [...prev, request]);
  };

  const executePausedRequests = async () => {
    if (isOnline && pausedRequests.length > 0) {
      toast({
        title: 'Syncing',
        description: `Executing ${pausedRequests.length} pending requests...`,
      });
      
      const requests = [...pausedRequests];
      setPausedRequests([]);
      
      try {
        await Promise.allSettled(requests.map(req => req()));
        
        toast({
          title: 'Sync complete',
          description: 'All pending requests have been processed.',
        });
      } catch (error) {
        console.error('Error executing paused requests:', error);
        
        toast({
          title: 'Sync error',
          description: 'Some requests failed to complete.',
          variant: 'destructive',
        });
      }
    }
  };

  const clearPausedRequests = () => {
    setPausedRequests([]);
  };

  // Automatically attempt to execute paused requests when coming back online
  useEffect(() => {
    if (isOnline && pausedRequests.length > 0) {
      executePausedRequests();
    }
  }, [isOnline]);

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        isOffline,
        lastOnlineAt,
        pausedRequests,
        addPausedRequest,
        executePausedRequests,
        clearPausedRequests,
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
