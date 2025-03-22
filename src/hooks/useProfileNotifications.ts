
import { useToast } from '@/hooks/toast/use-toast';
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
      toast.success(
        "Settings Updated", 
        { description: `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${checked ? 'enabled' : 'disabled'}` }
      );
    } else {
      toast.error(
        "Error", 
        { description: "Failed to update notification settings" }
      );
    }
  };
  
  const handleResetNotifications = async () => {
    const success = await resetNotificationSettings();
    
    if (success) {
      toast.success(
        "Reset Complete", 
        { description: "Notification settings have been reset to defaults" }
      );
    } else {
      toast.error(
        "Error", 
        { description: "Failed to reset notification settings" }
      );
    }
  };

  return {
    notificationSettings,
    notificationsLoading,
    handleNotificationChange,
    handleResetNotifications
  };
};
