
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAdvancedSettings = () => {
  const { toast } = useToast();
  const [debugMode, setDebugMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [rateLimiting, setRateLimiting] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [systemStatus, setSystemStatus] = useState({
    uptime: '3d 4h 27m',
    performanceLevel: 'Normal',
    errors: 0,
    warnings: 0
  });

  // Simulating retrieving settings from storage (localStorage for demo)
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('adminSettings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setDebugMode(parsedSettings.debugMode ?? false);
        setMaintenanceMode(parsedSettings.maintenanceMode ?? false);
        setRateLimiting(parsedSettings.rateLimiting ?? true);
        setAnalytics(parsedSettings.analytics ?? true);
        setLastUpdated(parsedSettings.lastUpdated ? new Date(parsedSettings.lastUpdated) : new Date());
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    try {
      const settingsToSave = {
        debugMode,
        maintenanceMode,
        rateLimiting,
        analytics,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('adminSettings', JSON.stringify(settingsToSave));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [debugMode, maintenanceMode, rateLimiting, analytics]);

  const handleSettingChange = (setting: string, value: boolean) => {
    switch (setting) {
      case 'debugMode':
        setDebugMode(value);
        toast({
          title: value ? "Debug Mode Enabled" : "Debug Mode Disabled",
          description: value 
            ? "Detailed error messages will now be displayed." 
            : "Detailed error messages will be hidden.",
          variant: value ? "default" : "default"
        });
        break;
      case 'maintenanceMode':
        setMaintenanceMode(value);
        toast({
          title: value ? "Maintenance Mode Activated" : "Maintenance Mode Deactivated",
          description: value 
            ? "The application is now in maintenance mode." 
            : "The application is now accessible to all users.",
          variant: value ? "destructive" : "default"
        });
        break;
      case 'rateLimiting':
        setRateLimiting(value);
        toast({
          title: value ? "Rate Limiting Enabled" : "Rate Limiting Disabled",
          description: value 
            ? "API rate limiting is now active." 
            : "API rate limiting has been disabled.",
          variant: value ? "default" : "default"
        });
        break;
      case 'analytics':
        setAnalytics(value);
        toast({
          title: value ? "Analytics Enabled" : "Analytics Disabled",
          description: value 
            ? "Usage analytics collection is now active." 
            : "Usage analytics collection has been disabled.",
          variant: value ? "default" : "default"
        });
        break;
    }
  };

  return {
    settings: {
      debugMode,
      maintenanceMode,
      rateLimiting,
      analytics,
      lastUpdated,
      systemStatus
    },
    handleSettingChange
  };
};
