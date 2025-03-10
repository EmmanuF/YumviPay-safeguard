
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import OfflineBanner from '@/components/OfflineBanner';
import { addPausedRequest as addPausedRequestUtil } from '@/utils/networkUtils';

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

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const { isOnline } = useNetworkStatus();
  const [isOffline, setIsOffline] = useState(!isOnline);
  const [offlineModeActive, setOfflineModeActive] = useState(false);

  useEffect(() => {
    setIsOffline(!isOnline);
  }, [isOnline]);

  // Function to add a request to the queue
  const addPausedRequest = (callback: () => Promise<any>) => {
    addPausedRequestUtil(callback);
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

export { OfflineBanner };
