
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountInformation from './AccountInformation';
import SecuritySettings from './SecuritySettings';
import { NotificationPreferences } from './notification';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { toast } from '@/hooks/use-toast';

interface ProfileContentProps {
  user: {
    name: string;
    email: string;
    phone: string;
    country: string;
  };
  onEdit: (field: string, value: string) => void;
  onChangePassword: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ 
  user, 
  onEdit, 
  onChangePassword 
}) => {
  const { 
    settings: notificationSettings, 
    loading: notificationsLoading, 
    updateSetting: updateNotificationSetting,
    resetSettings: resetNotificationSettings
  } = useNotificationSettings();

  const handleNotificationChange = async (key: keyof typeof notificationSettings, checked: boolean) => {
    const success = await updateNotificationSetting(key, checked);
    
    if (success) {
      toast({
        title: "Settings Updated",
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${checked ? 'enabled' : 'disabled'}`
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive"
      });
    }
  };
  
  const handleResetNotifications = async () => {
    const success = await resetNotificationSettings();
    
    if (success) {
      toast({
        title: "Reset Complete",
        description: "Notification settings have been reset to defaults"
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to reset notification settings",
        variant: "destructive"
      });
    }
  };

  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>
      
      <TabsContent value="account" className="space-y-4">
        <AccountInformation user={user} onEdit={onEdit} />
        <SecuritySettings onChangePassword={onChangePassword} />
      </TabsContent>
      
      <TabsContent value="preferences" className="space-y-4">
        <NotificationPreferences 
          settings={notificationSettings}
          isLoading={notificationsLoading}
          onSettingChange={handleNotificationChange}
          onResetDefaults={handleResetNotifications}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileContent;
