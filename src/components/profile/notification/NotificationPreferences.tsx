
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NotificationSettings } from '@/hooks/useNotificationSettings';
import NotificationsList from './NotificationsList';
import { notificationTypes, notificationChannels } from './NotificationPreferencesData';

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
          <NotificationsList
            title="NOTIFICATION TYPES"
            items={notificationTypes}
            settings={settings}
            isLoading={isLoading}
            onSettingChange={onSettingChange}
          />
          
          <Separator />
          
          {/* Notification Channels */}
          <NotificationsList
            title="NOTIFICATION CHANNELS"
            items={notificationChannels}
            settings={settings}
            isLoading={isLoading}
            onSettingChange={onSettingChange}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationPreferences;
