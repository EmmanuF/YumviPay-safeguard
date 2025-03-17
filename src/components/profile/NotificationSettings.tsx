
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationPreferences } from './NotificationPreferences';
import { NotificationSettings as NotificationSettingsType } from '@/types/notification';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  isLoading: boolean;
  onChange: (key: keyof NotificationSettingsType, checked: boolean) => void;
  onReset: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  isLoading,
  onChange,
  onReset
}) => {
  return (
    <div className="space-y-6">
      <NotificationPreferences
        settings={settings}
        isLoading={isLoading}
        onSettingChange={onChange}
        onResetDefaults={onReset}
      />

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>Control what kinds of notifications you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Manage your notification preferences in the card above. You'll receive notifications based on your selected channels (push, email, SMS).
          </p>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={onReset}
              disabled={isLoading}
            >
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
