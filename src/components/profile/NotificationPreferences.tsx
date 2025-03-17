
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationSettings } from '@/hooks/useNotificationSettings';
import { OfflineModeToggle } from '@/components/OfflineModeToggle';
import { useNetwork } from '@/contexts/NetworkContext';
import { Badge } from '@/components/ui/badge';

interface NotificationPreferencesProps {
  settings: NotificationSettings;
  isLoading: boolean;
  onSettingChange: (key: keyof NotificationSettings, checked: boolean) => void;
  onResetDefaults: () => void;
}

export function NotificationPreferences({ 
  settings, 
  isLoading, 
  onSettingChange, 
  onResetDefaults 
}: NotificationPreferencesProps) {
  const { pendingOperationsCount, lastSyncTime } = useNetwork();
  
  // Use the properties from the settings object
  const pushEnabled = settings.push;
  const emailEnabled = settings.email;
  const smsEnabled = settings.sms;

  // Create toggle functions that call onSettingChange
  const togglePush = (checked: boolean) => onSettingChange('push', checked);
  const toggleEmail = (checked: boolean) => onSettingChange('email', checked);
  const toggleSms = (checked: boolean) => onSettingChange('sms', checked);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications & Preferences</CardTitle>
        <CardDescription>
          Manage how you receive notifications and application settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notification Channels</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="push" className="flex flex-col">
                <span>Push Notifications</span>
                <span className="text-sm text-gray-500">Receive alerts on your device</span>
              </Label>
              <Switch id="push" checked={pushEnabled} onCheckedChange={togglePush} disabled={isLoading} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="flex flex-col">
                <span>Email Notifications</span>
                <span className="text-sm text-gray-500">Receive transaction updates via email</span>
              </Label>
              <Switch id="email" checked={emailEnabled} onCheckedChange={toggleEmail} disabled={isLoading} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sms" className="flex flex-col">
                <span>SMS Notifications</span>
                <span className="text-sm text-gray-500">Receive text messages for critical updates</span>
              </Label>
              <Switch id="sms" checked={smsEnabled} onCheckedChange={toggleSms} disabled={isLoading} />
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <h3 className="text-sm font-medium mb-4">Application Settings</h3>
          <div className="space-y-4">
            <OfflineModeToggle showSync={true} />
            
            {lastSyncTime && (
              <div className="text-xs text-gray-500 mt-1">
                Last sync: {lastSyncTime.toLocaleString()}
                {pendingOperationsCount > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {pendingOperationsCount} pending
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default NotificationPreferences;
