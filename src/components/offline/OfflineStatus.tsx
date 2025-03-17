
import React from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { motion } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface OfflineStatusProps {
  compact?: boolean;
  className?: string;
}

export const OfflineStatus: React.FC<OfflineStatusProps> = ({ 
  compact = false,
  className = '' 
}) => {
  const { 
    isOffline, 
    offlineModeActive, 
    pendingOperationsCount, 
    syncOfflineData, 
    isSyncing,
    lastSyncTime,
    offlineSince
  } = useNetwork();
  
  const showOfflineInfo = isOffline || offlineModeActive;
  
  if (!showOfflineInfo) {
    return null;
  }
  
  // Format offline time if available
  const offlineTimeDisplay = offlineSince 
    ? formatDistanceToNow(offlineSince, { addSuffix: true })
    : '';
  
  // Format last sync time if available
  const lastSyncDisplay = lastSyncTime 
    ? formatDistanceToNow(lastSyncTime, { addSuffix: true })
    : 'Never';
  
  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <WifiOff className="h-4 w-4 text-amber-500" />
        <span className="text-sm text-amber-500 font-medium">
          {isOffline ? 'Offline' : 'Offline Mode'}
        </span>
        {pendingOperationsCount > 0 && !isOffline && (
          <Badge variant="outline" className="text-xs">
            {pendingOperationsCount} pending
          </Badge>
        )}
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className={isOffline ? "border-amber-500" : "border-blue-500"}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${isOffline ? "bg-amber-100" : "bg-blue-100"} mr-3`}>
                <WifiOff className={`h-5 w-5 ${isOffline ? "text-amber-500" : "text-blue-500"}`} />
              </div>
              <div>
                <h3 className="font-medium">
                  {isOffline ? "You're offline" : "Offline Mode Active"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isOffline
                    ? "Connect to the internet to sync your data"
                    : "Your changes will be saved locally"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-2 space-y-2 text-sm">
            {offlineSince && (
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>Offline {offlineTimeDisplay}</span>
              </div>
            )}
            
            {pendingOperationsCount > 0 && (
              <div className="flex items-center text-muted-foreground">
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>
                  {pendingOperationsCount} {pendingOperationsCount === 1 ? 'operation' : 'operations'} pending
                  {!isOffline && lastSyncTime && ` • Last sync ${lastSyncDisplay}`}
                </span>
              </div>
            )}
            
            {!isOffline && pendingOperationsCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={syncOfflineData}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="mr-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OfflineStatus;
