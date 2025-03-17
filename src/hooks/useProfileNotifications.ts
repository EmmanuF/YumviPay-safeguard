
import { useToast } from '@/hooks/use-toast';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';

export const useProfileNotifications = () => {
  const { toast } = useToast();
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

  return {
    notificationSettings,
    notificationsLoading,
    handleNotificationChange,
    handleResetNotifications
  };
};
