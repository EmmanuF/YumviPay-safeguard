
import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface OfflineModeToggleProps {
  variant?: 'switch' | 'button';
  className?: string;
}

export const OfflineModeToggle: React.FC<OfflineModeToggleProps> = ({ 
  variant = 'switch',
  className = ''
}) => {
  const { isOffline, offlineModeActive, toggleOfflineMode } = useNetwork();
  
  // If actually offline, disable the toggle
  const isDisabled = isOffline;
  
  if (variant === 'button') {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleOfflineMode}
        disabled={isDisabled}
        className={className}
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
    );
  }
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        id="offline-mode"
        checked={offlineModeActive}
        onCheckedChange={toggleOfflineMode}
        disabled={isDisabled}
      />
      <Label htmlFor="offline-mode" className="text-sm cursor-pointer">
        {offlineModeActive ? 'Offline Mode' : 'Online Mode'}
      </Label>
    </div>
  );
};

export default OfflineModeToggle;
