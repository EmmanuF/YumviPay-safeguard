
import { useState, useEffect, useContext } from 'react';
import { NetworkContext } from './NetworkContext';
import { NetworkContextType } from './types';

export const useNetwork = (): NetworkContextType => {
  const networkContext = useContext(NetworkContext);
  
  if (!networkContext) {
    // Provide a default implementation if the context is not available
    // This helps prevent errors during testing or when used outside of the NetworkProvider
    const [isOnline, setIsOnline] = useState<boolean>(
      typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);

    // Default implementation with minimal functionality
    return {
      isOnline,
      isOffline: !isOnline,
      offlineModeActive: false,
      toggleOfflineMode: () => console.warn('NetworkProvider not found. toggleOfflineMode is not available.'),
      pendingOperationsCount: 0,
      syncOfflineData: async () => {
        console.warn('NetworkProvider not found. syncOfflineData is not available.');
        return false;
      },
      isSyncing: false,
      lastSyncTime: null,
      offlineSince: null,
      addPausedRequest: () => console.warn('NetworkProvider not found. addPausedRequest is not available.')
    };
  }

  return networkContext;
};
