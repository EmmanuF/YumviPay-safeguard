
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecuritySettings, NotificationPreferences, ChangePasswordDialog, AccountInformation } from '@/components/profile';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { NotificationSettings } from '@/types/notification';

// Import the MobileAppSettings component
import MobileAppSettings from './MobileAppSettings';

// Define props for AccountInformation
interface AccountInformationProps {
  user: any;
  onEdit: (field: string, value: string) => void;
}

interface ProfileTabsProps {
  user?: any;
  onEditField?: (field: string, value: string) => void;
  onChangePassword?: () => void;
  notificationSettings?: NotificationSettings;
  notificationsLoading?: boolean;
  onNotificationChange?: (key: keyof NotificationSettings, checked: boolean) => Promise<void>;
  onResetNotifications?: () => Promise<void>;
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
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="space-y-4">
        <AccountTabContent user={user} onEdit={onEditField} />
      </TabsContent>
      <TabsContent value="security" className="space-y-4">
        <SecurityTabContent onChangePassword={onChangePassword} />
      </TabsContent>
      <TabsContent value="settings">
        <SettingsTabContent 
          onChangePassword={onChangePassword}
          notificationSettings={notificationSettings}
          notificationsLoading={notificationsLoading}
          onNotificationChange={onNotificationChange}
          onResetNotifications={onResetNotifications}
        />
      </TabsContent>
    </Tabs>
  );
};

const AccountTabContent: React.FC<AccountInformationProps> = ({ user, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <AccountInformation user={user} onEdit={onEdit} />
    </motion.div>
  );
};

const SecurityTabContent: React.FC<{ onChangePassword?: () => void }> = ({ onChangePassword }) => {
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

  const handleChangePassword = () => {
    if (onChangePassword) {
      onChangePassword();
    } else {
      setShowChangePasswordDialog(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 py-4"
    >
      <SecuritySettings onChangePassword={handleChangePassword} />
      <ChangePasswordDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
      />
    </motion.div>
  );
};

interface SettingsTabContentProps {
  onChangePassword?: () => void;
  notificationSettings?: NotificationSettings;
  notificationsLoading?: boolean;
  onNotificationChange?: (key: keyof NotificationSettings, checked: boolean) => Promise<void>;
  onResetNotifications?: () => Promise<void>;
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({
  onChangePassword,
  notificationSettings,
  notificationsLoading,
  onNotificationChange,
  onResetNotifications
}) => {
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const { 
    settings: localSettings, 
    loading: localLoading, 
    updateSetting: localUpdateSetting, 
    resetSettings: localResetSettings 
  } = useNotificationSettings();

  // Use props if provided, otherwise use local state
  const settings = notificationSettings || localSettings;
  const loading = notificationsLoading !== undefined ? notificationsLoading : localLoading;
  const updateSetting = onNotificationChange || localUpdateSetting;
  const resetSettings = onResetNotifications || localResetSettings;

  const handleChangePassword = () => {
    if (onChangePassword) {
      onChangePassword();
    } else {
      setShowChangePasswordDialog(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 py-4"
    >
      {/* Add MobileAppSettings at the top of the settings tab */}
      <MobileAppSettings />
      
      <SecuritySettings onChangePassword={handleChangePassword} />
      
      <NotificationPreferences
        settings={settings}
        isLoading={loading}
        onSettingChange={updateSetting}
        onResetDefaults={resetSettings}
      />
      
      <ChangePasswordDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
      />
    </motion.div>
  );
};

export default ProfileTabs;
