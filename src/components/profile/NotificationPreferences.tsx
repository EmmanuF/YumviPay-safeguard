
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, ShoppingBag, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NotificationSettings } from '@/hooks/useNotificationSettings';

interface NotificationPreferencesProps {
  settings: NotificationSettings;
  isLoading?: boolean;
  onSettingChange: (key: keyof NotificationSettings, checked: boolean) => void;
  onResetDefaults: () => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ 
  settings, 
  isLoading = false,
  onSettingChange,
  onResetDefaults
}) => {
  // Helper function to get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'transactions':
        return <Bell className="h-5 w-5 text-primary-500" />;
      case 'marketing':
        return <ShoppingBag className="h-5 w-5 text-primary-500" />;
      case 'updates':
        return <RefreshCcw className="h-5 w-5 text-primary-500" />;
      case 'email':
        return <Mail className="h-5 w-5 text-primary-500" />;
      case 'push':
        return <Bell className="h-5 w-5 text-primary-500" />;
      case 'sms':
        return <MessageSquare className="h-5 w-5 text-primary-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary-500" />;
    }
  };
  
  const notificationTypes = [
    { key: 'transactions', label: 'Transaction alerts', description: 'Get notified about your transaction status updates' },
    { key: 'marketing', label: 'Marketing emails', description: 'Receive promotional offers and discounts' },
    { key: 'updates', label: 'App updates', description: 'Get notified about new features and app updates' }
  ];
  
  const notificationChannels = [
    { key: 'email', label: 'Email notifications', description: 'Receive notifications via email' },
    { key: 'push', label: 'Push notifications', description: 'Receive notifications on your device' },
    { key: 'sms', label: 'SMS notifications', description: 'Receive notifications via text message' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Notifications</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onResetDefaults}
            disabled={isLoading}
          >
            Reset to defaults
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Notification Types */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">NOTIFICATION TYPES</h3>
            
            {notificationTypes.map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(key)}
                  <div>
                    <Label htmlFor={`notification-${key}`} className="font-medium">{label}</Label>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Switch
                  id={`notification-${key}`}
                  checked={settings[key as keyof NotificationSettings]}
                  onCheckedChange={(checked) => onSettingChange(key as keyof NotificationSettings, checked)}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
          
          <Separator />
          
          {/* Notification Channels */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">NOTIFICATION CHANNELS</h3>
            
            {notificationChannels.map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(key)}
                  <div>
                    <Label htmlFor={`channel-${key}`} className="font-medium">{label}</Label>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Switch
                  id={`channel-${key}`}
                  checked={settings[key as keyof NotificationSettings]}
                  onCheckedChange={(checked) => onSettingChange(key as keyof NotificationSettings, checked)}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationPreferences;
