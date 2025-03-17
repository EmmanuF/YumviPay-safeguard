
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NotificationSettings } from '@/types/notification';

interface NotificationPreferencesProps {
  settings: NotificationSettings;
  isLoading: boolean;
  onSettingChange: (key: keyof NotificationSettings, checked: boolean) => void;
  onResetDefaults: () => void;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  settings,
  isLoading,
  onSettingChange,
  onResetDefaults
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose what notifications you receive and how</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notification Categories</h3>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="transactions">Transaction Updates</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your transactions</p>
              </div>
              <Switch
                id="transactions"
                checked={settings.transactions}
                disabled={isLoading}
                onCheckedChange={(checked) => onSettingChange('transactions', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing">Marketing</Label>
                <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
              </div>
              <Switch
                id="marketing"
                checked={settings.marketing}
                disabled={isLoading}
                onCheckedChange={(checked) => onSettingChange('marketing', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="updates">System Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified about system updates and new features</p>
              </div>
              <Switch
                id="updates"
                checked={settings.updates}
                disabled={isLoading}
                onCheckedChange={(checked) => onSettingChange('updates', checked)}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notification Channels</h3>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="email"
                checked={settings.email}
                disabled={isLoading}
                onCheckedChange={(checked) => onSettingChange('email', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
              </div>
              <Switch
                id="push"
                checked={settings.push}
                disabled={isLoading}
                onCheckedChange={(checked) => onSettingChange('push', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
              </div>
              <Switch
                id="sms"
                checked={settings.sms}
                disabled={isLoading}
                onCheckedChange={(checked) => onSettingChange('sms', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
