
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface NotificationPreferences {
  transactions: boolean;
  marketing: boolean;
  updates: boolean;
}

interface NotificationPreferencesProps {
  notifications: NotificationPreferences;
  onNotificationChange: (key: keyof NotificationPreferences, checked: boolean) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ 
  notifications, 
  onNotificationChange 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="transaction-notifications">Transaction alerts</Label>
            <p className="text-sm text-muted-foreground">Receive notifications about your transactions</p>
          </div>
          <Switch
            id="transaction-notifications"
            checked={notifications.transactions}
            onCheckedChange={(checked) => onNotificationChange('transactions', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing-notifications">Marketing emails</Label>
            <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
          </div>
          <Switch
            id="marketing-notifications"
            checked={notifications.marketing}
            onCheckedChange={(checked) => onNotificationChange('marketing', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="update-notifications">App updates</Label>
            <p className="text-sm text-muted-foreground">Receive notifications about app updates</p>
          </div>
          <Switch
            id="update-notifications"
            checked={notifications.updates}
            onCheckedChange={(checked) => onNotificationChange('updates', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
