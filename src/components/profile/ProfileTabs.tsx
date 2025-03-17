
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountInformation from './AccountInformation';
import SecuritySettings from './SecuritySettings';
import NotificationPreferences from './NotificationPreferences';
import { NotificationSettings } from '@/hooks/useNotificationSettings';

interface ProfileTabsProps {
  user: any;
  onEditField: (field: string, value: string) => void;
  onChangePassword: () => void;
  notificationSettings: NotificationSettings;
  notificationsLoading: boolean;
  onNotificationChange: (key: keyof NotificationSettings, checked: boolean) => void;
  onResetNotifications: () => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  user,
  onEditField,
  onChangePassword,
  notificationSettings,
  notificationsLoading,
  onNotificationChange,
  onResetNotifications
}) => {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>
      
      <TabsContent value="account" className="space-y-4">
        <AccountInformation user={user} onEdit={onEditField} />
        <SecuritySettings onChangePassword={onChangePassword} />
      </TabsContent>
      
      <TabsContent value="preferences" className="space-y-4">
        <NotificationPreferences 
          settings={notificationSettings}
          isLoading={notificationsLoading}
          onSettingChange={onNotificationChange}
          onResetDefaults={onResetNotifications}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
