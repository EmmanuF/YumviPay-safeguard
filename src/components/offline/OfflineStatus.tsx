
import React from 'react';
import { useNetwork } from '@/contexts/network';
import { motion } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Progress } from '@/components/ui/progress';

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
        <WifiOff className={`h-4 w-4 ${isOffline ? "text-red-500" : "text-amber-500"}`} />
        <span className={`text-sm font-medium ${isOffline ? "text-red-500" : "text-amber-500"}`}>
          {isOffline ? 'Offline' : 'Offline Mode'}
        </span>
        {pendingOperationsCount > 0 && (
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
      <Card className={isOffline ? "border-red-500" : "border-amber-500"}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${isOffline ? "bg-red-100" : "bg-amber-100"} mr-3`}>
                <WifiOff className={`h-5 w-5 ${isOffline ? "text-red-500" : "text-amber-500"}`} />
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
              <div className="space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <span>
                      {pendingOperationsCount} {pendingOperationsCount === 1 ? 'operation' : 'operations'} pending
                    </span>
                  </div>
                  {!isOffline && lastSyncTime && (
                    <div className="flex items-center text-xs">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                      <span>Last sync {lastSyncDisplay}</span>
                    </div>
                  )}
                </div>
                
                {isSyncing && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Syncing your data...</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-1" />
                  </div>
                )}
              </div>
            )}
            
            {!isOffline && pendingOperationsCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className={`w-full mt-2 ${isSyncing ? "bg-primary-50" : ""}`}
                onClick={syncOfflineData}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="mr-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </motion.div>
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OfflineStatus;
