
import React from 'react';

// Paused requests queue
export const pausedRequests: Array<() => Promise<any>> = [];

export interface NetworkContextType {
  isOffline: boolean;
  isOnline: boolean;
  offlineModeActive: boolean;
  toggleOfflineMode: () => void;
  syncOfflineData: () => Promise<boolean>;
  lastSyncTime: Date | null;
  pendingOperationsCount: number;
  isSyncing: boolean;
  offlineSince: Date | null;
  addPausedRequest: (callback: () => Promise<any>) => void;
}

export interface NetworkProviderProps {
  children: React.ReactNode;
}
