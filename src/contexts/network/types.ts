
import { ReactNode } from 'react';

export interface NetworkContextType {
  isOnline: boolean;
  isOffline: boolean;
  offlineModeActive: boolean;
  toggleOfflineMode: () => void;
  pendingOperationsCount: number;
  syncOfflineData: () => Promise<boolean>;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  offlineSince: Date | null;
  addPausedRequest: (callback: () => Promise<any>) => void;
}

export interface NetworkProviderProps {
  children: ReactNode;
}
