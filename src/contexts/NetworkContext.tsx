
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus as useDeviceNetworkStatus } from '@/hooks/useNetworkStatus';

type NetworkContextType = {
  isOffline: boolean;
  isOnline: boolean;
  addPausedRequest: (callback: () => Promise<any>) => void;
  offlineModeActive: boolean;
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

  useEffect(() => {
    setIsOffline(!isOnline);
    
    // If coming back online, process any queued requests
    if (isOnline && pausedRequests.length > 0) {
      console.log(`Processing ${pausedRequests.length} queued requests`);
      
      // Process all paused requests
      [...pausedRequests].forEach(async (request) => {
        try {
          await request();
          // Remove from queue after successful processing
          const index = pausedRequests.indexOf(request);
          if (index > -1) {
            pausedRequests.splice(index, 1);
          }
        } catch (error) {
          console.error('Error processing queued request:', error);
        }
      });
    }
  }, [isOnline]);

  // Function to add a request to the queue
  const addPausedRequest = (callback: () => Promise<any>) => {
    pausedRequests.push(callback);
    console.log(`Request added to queue. Total: ${pausedRequests.length}`);
  };

  return (
    <NetworkContext.Provider value={{ 
      isOffline, 
      isOnline, 
      addPausedRequest,
      offlineModeActive
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
