
import { useNetwork } from '@/contexts/NetworkContext';
import { isPlatform } from '@/utils/platformUtils';
import { formatDistanceToNow } from 'date-fns';

/**
 * Hook to provide comprehensive offline status information for components
 */
export function useOfflineStatus() {
  const { 
    isOffline, 
    isOnline, 
    offlineModeActive, 
    toggleOfflineMode,
    pendingOperationsCount,
    syncOfflineData,
    isSyncing,
    lastSyncTime,
    offlineSince
  } = useNetwork();
  
  // Check if we're on a native platform
  const isNativePlatform = isPlatform('capacitor');
  
  // Format time values
  const offlineTime = offlineSince 
    ? formatDistanceToNow(offlineSince, { addSuffix: true })
    : '';
    
  const lastSyncTimeFormatted = lastSyncTime
    ? formatDistanceToNow(lastSyncTime, { addSuffix: true })
    : 'Never';
  
  // Status summary for display
  const statusSummary = 
    isOffline 
      ? `Offline ${offlineTime ? `since ${offlineTime}` : ''}`
      : offlineModeActive
        ? 'Offline Mode Active'
        : 'Online';
        
  // Show user if data is still in sync or needs syncing
  const syncStatus = 
    !isOnline 
      ? 'Unable to sync while offline'
      : pendingOperationsCount > 0
        ? `${pendingOperationsCount} operations pending sync`
        : 'All data in sync';
        
  return {
    // Basic status
    isOffline,
    isOnline,
    offlineModeActive,
    toggleOfflineMode,
    
    // Sync functionality
    pendingOperationsCount,
    syncOfflineData,
    isSyncing,
    
    // Timing information
    lastSyncTime,
    offlineSince,
    
    // Formatted values
    offlineTime,
    lastSyncTimeFormatted,
    
    // Derived values
    statusSummary,
    syncStatus,
    isNativePlatform,
    
    // Combined states
    isEffectivelyOffline: isOffline || offlineModeActive,
    canSync: !isOffline && pendingOperationsCount > 0 && !isSyncing,
    needsSync: pendingOperationsCount > 0
  };
}

export default useOfflineStatus;
