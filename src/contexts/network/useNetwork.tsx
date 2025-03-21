
import { useContext } from 'react';
import { NetworkContext } from './NetworkContext';
import { NetworkContextType } from './types';

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  
  if (context === undefined) {
    console.warn('useNetwork must be used within a NetworkProvider');
    // Return fallback values if context is missing
    return {
      isOnline: true,
      isOffline: false,
      offlineModeActive: false,
      toggleOfflineMode: () => console.warn('NetworkProvider not available'),
      pendingOperationsCount: 0,
      syncOfflineData: async () => false,
      isSyncing: false,
      lastSyncTime: null,
      offlineSince: null,
      addPausedRequest: () => console.warn('NetworkProvider not available'),
    };
  }
  
  return context;
};
