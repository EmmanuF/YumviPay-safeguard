
import { AlertTriangle, WifiOff, RefreshCw, Toggle } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { Button } from './ui/button';

export function OfflineBanner() {
  const { isOffline, status } = useNetworkStatus();
  const { 
    pausedRequests, 
    executePausedRequests, 
    syncInProgress,
    offlineModeActive,
    toggleOfflineMode
  } = useNetwork();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Show the banner if offline or if there are pending requests
    if (isOffline || offlineModeActive || pausedRequests.length > 0) {
      setVisible(true);
    } else {
      // Hide after a delay when coming back online
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOffline, offlineModeActive, pausedRequests.length]);
  
  if (!visible) return null;
  
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 p-2 transition-all duration-300",
        "bg-amber-50 border-b border-amber-200",
        "flex items-center justify-between",
        isOffline || offlineModeActive ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="flex items-center gap-2">
        {(isOffline || offlineModeActive) ? (
          <WifiOff className="h-4 w-4 text-amber-600" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-amber-600" />
        )}
        
        <p className="text-sm font-medium text-amber-800">
          {offlineModeActive 
            ? "Offline mode is enabled" 
            : isOffline 
              ? "You're currently offline. Changes will sync when connection returns."
              : "Connected. Syncing data..."
          }
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {pausedRequests.length > 0 && !isOffline && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 text-xs bg-amber-100 border-amber-200"
            onClick={executePausedRequests}
            disabled={syncInProgress}
          >
            {syncInProgress ? (
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            Sync {pausedRequests.length} {pausedRequests.length === 1 ? 'change' : 'changes'}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-amber-800"
          onClick={toggleOfflineMode}
        >
          <Toggle className="h-3 w-3 mr-1" />
          {offlineModeActive ? 'Disable offline mode' : 'Enable offline mode'}
        </Button>
      </div>
    </div>
  );
}
