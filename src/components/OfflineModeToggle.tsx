
import React from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface OfflineModeToggleProps {
  variant?: 'switch' | 'button';
  className?: string;
  showSync?: boolean;
}

export const OfflineModeToggle: React.FC<OfflineModeToggleProps> = ({ 
  variant = 'switch',
  className = '',
  showSync = false
}) => {
  const { 
    isOffline, 
    offlineModeActive, 
    toggleOfflineMode, 
    syncOfflineData,
    pendingOperationsCount
  } = useNetwork();
  const [syncing, setSyncing] = React.useState(false);
  
  // If actually offline, disable the toggle
  const isDisabled = isOffline;
  
  const handleSync = async () => {
    setSyncing(true);
    await syncOfflineData();
    setSyncing(false);
  };
  
  if (variant === 'button') {
    return (
      <div className={`space-y-2 ${className}`}>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleOfflineMode}
          disabled={isDisabled}
          className="w-full"
        >
          {offlineModeActive ? (
            <>
              <Wifi className="h-4 w-4 mr-2" />
              Exit Offline Mode
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 mr-2" />
              Enable Offline Mode
            </>
          )}
        </Button>
        
        {showSync && pendingOperationsCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSync}
            disabled={isOffline || syncing}
            className="w-full"
          >
            <motion.div
              animate={syncing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ repeat: syncing ? Infinity : 0, duration: 1 }}
              className="mr-2"
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
            Sync {pendingOperationsCount} Operations
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor="offline-mode" className="flex flex-col">
          <div className="flex items-center">
            <span>Offline Mode</span>
            {pendingOperationsCount > 0 && (
              <Badge variant="outline" className="ml-2 text-xs">
                {pendingOperationsCount} pending
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {offlineModeActive 
              ? 'App will work offline and sync later' 
              : 'App will require internet connection'}
          </span>
        </Label>
        <Switch
          id="offline-mode"
          checked={offlineModeActive}
          onCheckedChange={toggleOfflineMode}
          disabled={isDisabled}
        />
      </div>
      
      {showSync && pendingOperationsCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={isOffline || syncing}
          className="w-full"
        >
          <motion.div
            animate={syncing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: syncing ? Infinity : 0, duration: 1 }}
            className="mr-2"
          >
            <RefreshCw className="h-4 w-4" />
          </motion.div>
          Sync Pending Operations
        </Button>
      )}
    </div>
  );
};

export default OfflineModeToggle;
