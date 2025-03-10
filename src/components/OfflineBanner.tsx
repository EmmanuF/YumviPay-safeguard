
import { AlertTriangle, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function OfflineBanner() {
  const { isOffline, status } = useNetworkStatus();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Show the banner if offline
    if (isOffline) {
      setVisible(true);
    } else {
      // Hide after a delay when coming back online
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOffline]);
  
  if (!visible) return null;
  
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 p-2 transition-transform duration-300",
        "bg-amber-50 border-b border-amber-200",
        "flex items-center justify-center gap-2",
        isOffline ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {isOffline ? (
        <WifiOff className="h-4 w-4 text-amber-600" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-amber-600" />
      )}
      
      <p className="text-sm font-medium text-amber-800">
        {isOffline 
          ? "You're currently offline. Some features may be limited." 
          : "Connected. Syncing data..."
        }
      </p>
    </div>
  );
}
