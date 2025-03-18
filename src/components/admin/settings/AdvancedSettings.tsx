
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const AdvancedSettings = () => {
  const { toast } = useToast();

  return (
    <Card className="border-primary-100/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>
          Configure advanced system settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Debug Mode</h3>
              <p className="text-sm text-muted-foreground">
                Enable detailed error messages and logging
              </p>
            </div>
            <Switch 
              onCheckedChange={(checked) => toast({
                title: checked ? "Debug Mode Enabled" : "Debug Mode Disabled",
                description: checked 
                  ? "Detailed error messages will now be displayed." 
                  : "Detailed error messages will be hidden."
              })} 
            />
          </div>
          
          <div className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Maintenance Mode</h3>
              <p className="text-sm text-muted-foreground">
                Put the application in maintenance mode
              </p>
            </div>
            <Switch 
              onCheckedChange={(checked) => toast({
                title: checked ? "Maintenance Mode Activated" : "Maintenance Mode Deactivated",
                description: checked 
                  ? "The application is now in maintenance mode." 
                  : "The application is now accessible to all users."
              })} 
            />
          </div>
          
          <div className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">API Rate Limiting</h3>
              <p className="text-sm text-muted-foreground">
                Enable rate limiting for API endpoints
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Usage Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Collect anonymous usage data
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => toast({
          title: "Settings Saved",
          description: "Advanced settings have been updated successfully.",
        })}>
          <Settings className="mr-2 h-4 w-4" />
          Save Advanced Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdvancedSettings;
