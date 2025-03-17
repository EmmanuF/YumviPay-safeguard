
import React from 'react';
import { WifiOff, Wifi, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { isPlatform } from '@/utils/platformUtils';

interface OfflineModeToggleProps {
  variant?: 'switch' | 'button';
  className?: string;
  showSync?: boolean;
  showDetails?: boolean;
}

export const OfflineModeToggle: React.FC<OfflineModeToggleProps> = ({ 
  variant = 'switch',
  className = '',
  showSync = false,
  showDetails = true
}) => {
  const { 
    isOffline, 
    offlineModeActive, 
    toggleOfflineMode, 
    syncOfflineData,
    pendingOperationsCount,
    isSyncing,
    lastSyncTime,
    offlineSince
  } = useNetwork();
  
  // If actually offline, disable the toggle
  const isDisabled = isOffline;
  
  // Format last sync time if available
  const lastSyncDisplay = lastSyncTime 
    ? formatDistanceToNow(lastSyncTime, { addSuffix: true })
    : 'Never';
    
  // Format time offline if available
  const offlineTimeDisplay = offlineSince 
    ? formatDistanceToNow(offlineSince, { addSuffix: true })
    : '';
  
  // Check if we're running in a native environment
  const isNative = isPlatform('capacitor');
  
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
            onClick={syncOfflineData}
            disabled={isOffline || isSyncing}
            className="w-full"
          >
            <motion.div
              animate={isSyncing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ repeat: isSyncing ? Infinity : 0, duration: 1 }}
              className="mr-2"
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
            {isSyncing ? 'Syncing...' : `Sync ${pendingOperationsCount} Operations`}
          </Button>
        )}
        
        {showDetails && (
          <div className="text-xs text-muted-foreground mt-2 space-y-1">
            {lastSyncTime && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last sync: {lastSyncDisplay}</span>
              </div>
            )}
            {offlineSince && (
              <div className="flex items-center text-amber-500">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>Offline {offlineTimeDisplay}</span>
              </div>
            )}
            {isNative && (
              <div className="pt-1 text-green-600">
                <Badge variant="outline" className="text-xs font-normal border-green-200 bg-green-50">
                  Native mode active
                </Badge>
              </div>
            )}
          </div>
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
          onClick={syncOfflineData}
          disabled={isOffline || isSyncing}
          className="w-full"
        >
          <motion.div
            animate={isSyncing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: isSyncing ? Infinity : 0, duration: 1 }}
            className="mr-2"
          >
            <RefreshCw className="h-4 w-4" />
          </motion.div>
          {isSyncing ? 'Syncing...' : 'Sync Pending Operations'}
        </Button>
      )}
      
      {showDetails && (
        <div className="text-xs text-muted-foreground space-y-1 mt-1">
          {lastSyncTime && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Last sync: {lastSyncDisplay}</span>
            </div>
          )}
          {offlineSince && (
            <div className="flex items-center text-amber-500">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>Offline {offlineTimeDisplay}</span>
            </div>
          )}
          {isNative && (
            <div className="pt-1">
              <Badge variant="outline" className="text-xs font-normal text-green-600 border-green-200 bg-green-50">
                Native mode active
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfflineModeToggle;
