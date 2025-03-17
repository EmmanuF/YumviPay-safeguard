
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileNotifications } from '@/hooks/useProfileNotifications';
import { OfflineModeToggle } from '@/components/OfflineModeToggle';

export function NotificationPreferences() {
  const { 
    pushEnabled, 
    emailEnabled, 
    smsEnabled, 
    togglePush, 
    toggleEmail, 
    toggleSms 
  } = useProfileNotifications();

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
              <Switch id="push" checked={pushEnabled} onCheckedChange={togglePush} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="flex flex-col">
                <span>Email Notifications</span>
                <span className="text-sm text-gray-500">Receive transaction updates via email</span>
              </Label>
              <Switch id="email" checked={emailEnabled} onCheckedChange={toggleEmail} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sms" className="flex flex-col">
                <span>SMS Notifications</span>
                <span className="text-sm text-gray-500">Receive text messages for critical updates</span>
              </Label>
              <Switch id="sms" checked={smsEnabled} onCheckedChange={toggleSms} />
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <h3 className="text-sm font-medium mb-4">Application Settings</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="offline-mode" className="flex flex-col">
              <span>Offline Mode</span>
              <span className="text-sm text-gray-500">Work offline and sync when connection is restored</span>
            </Label>
            <OfflineModeToggle />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default NotificationPreferences;
