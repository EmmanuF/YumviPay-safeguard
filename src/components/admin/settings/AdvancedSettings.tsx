
import React, { useState, useEffect } from 'react';
import { Settings, AlertTriangle, Construction, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAdvancedSettings } from '@/hooks/admin/settings/useAdvancedSettings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const AdvancedSettings = () => {
  const { settings, handleSettingChange } = useAdvancedSettings();
  const [showMaintenanceAlert, setShowMaintenanceAlert] = useState(false);

  // Show alert when maintenance mode is enabled
  useEffect(() => {
    if (settings.maintenanceMode) {
      setShowMaintenanceAlert(true);
      const timer = setTimeout(() => setShowMaintenanceAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [settings.maintenanceMode]);

  return (
    <Card className="border-primary-100/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Advanced Settings
        </CardTitle>
        <CardDescription>
          Configure advanced system settings
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {showMaintenanceAlert && (
          <Alert className="mb-4 border-yellow-300 bg-yellow-50" variant="default">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-700">Maintenance Mode Activated</AlertTitle>
            <AlertDescription className="text-yellow-600">
              The application is now in maintenance mode. Only administrators can access the system.
            </AlertDescription>
          </Alert>
        )}
        
        {settings.maintenanceMode && (
          <div className="mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 flex items-center gap-3">
            <Construction className="h-5 w-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-700">System Under Maintenance</h4>
              <p className="text-sm text-yellow-600">Only administrators can access the system while in maintenance mode.</p>
            </div>
            <Badge className="ml-auto bg-yellow-500">Active</Badge>
          </div>
        )}
        
        <div className="space-y-4">
          <div className={`flex flex-row items-center justify-between space-x-2 rounded-lg border p-4 ${settings.debugMode ? 'bg-blue-50 border-blue-200' : ''}`}>
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Debug Mode</h3>
              <p className="text-sm text-muted-foreground">
                Enable detailed error messages and logging
              </p>
            </div>
            <Switch 
              checked={settings.debugMode}
              onCheckedChange={(checked) => handleSettingChange('debugMode', checked)} 
            />
          </div>
          
          <div className={`flex flex-row items-center justify-between space-x-2 rounded-lg border p-4 ${settings.maintenanceMode ? 'bg-yellow-50 border-yellow-300' : ''}`}>
            <div className="space-y-0.5">
              <h3 className="text-base font-medium flex items-center gap-2">
                Maintenance Mode
                {settings.maintenanceMode && <Badge className="bg-yellow-500">Active</Badge>}
              </h3>
              <p className="text-sm text-muted-foreground">
                Put the application in maintenance mode
              </p>
            </div>
            <Switch 
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)} 
            />
          </div>
          
          <div className={`flex flex-row items-center justify-between space-x-2 rounded-lg border p-4 ${settings.rateLimiting ? 'bg-green-50 border-green-200' : ''}`}>
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">API Rate Limiting</h3>
              <p className="text-sm text-muted-foreground">
                Enable rate limiting for API endpoints
              </p>
            </div>
            <Switch 
              checked={settings.rateLimiting}
              onCheckedChange={(checked) => handleSettingChange('rateLimiting', checked)} 
            />
          </div>
          
          <div className={`flex flex-row items-center justify-between space-x-2 rounded-lg border p-4 ${settings.analytics ? 'bg-purple-50 border-purple-200' : ''}`}>
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Usage Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Collect anonymous usage data
              </p>
            </div>
            <Switch 
              checked={settings.analytics}
              onCheckedChange={(checked) => handleSettingChange('analytics', checked)} 
            />
          </div>
        </div>
        
        {settings.maintenanceMode && (
          <div className="mt-4 p-3 rounded-md bg-muted border flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Maintenance mode is currently active. Regular users cannot access the system.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button className="w-full">
          <Settings className="mr-2 h-4 w-4" />
          Save Advanced Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdvancedSettings;
