
export type NetworkContextType = {
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

export interface NetworkProviderProps {
  children: React.ReactNode;
}
