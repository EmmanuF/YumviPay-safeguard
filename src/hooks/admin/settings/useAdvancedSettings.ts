
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAdvancedSettings = () => {
  const { toast } = useToast();
  const [debugMode, setDebugMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [rateLimiting, setRateLimiting] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  const handleSettingChange = (setting: string, value: boolean) => {
    switch (setting) {
      case 'debugMode':
        setDebugMode(value);
        toast({
          title: value ? "Debug Mode Enabled" : "Debug Mode Disabled",
          description: value 
            ? "Detailed error messages will now be displayed." 
            : "Detailed error messages will be hidden."
        });
        break;
      case 'maintenanceMode':
        setMaintenanceMode(value);
        toast({
          title: value ? "Maintenance Mode Activated" : "Maintenance Mode Deactivated",
          description: value 
            ? "The application is now in maintenance mode." 
            : "The application is now accessible to all users."
        });
        break;
      case 'rateLimiting':
        setRateLimiting(value);
        break;
      case 'analytics':
        setAnalytics(value);
        break;
    }
  };

  return {
    settings: {
      debugMode,
      maintenanceMode,
      rateLimiting,
      analytics
    },
    handleSettingChange
  };
};
