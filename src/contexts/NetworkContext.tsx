
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import OfflineBanner from '@/components/OfflineBanner';

type NetworkContextType = {
  isOffline: boolean;
};

interface NetworkProviderProps {
  children: ReactNode;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const { isOnline } = useNetworkStatus();
  const [isOffline, setIsOffline] = useState(!isOnline);

  useEffect(() => {
    setIsOffline(!isOnline);
  }, [isOnline]);

  return (
    <NetworkContext.Provider value={{ isOffline }}>
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
