import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountInformation, SecuritySettings, NotificationPreferences, ChangePasswordDialog } from '@/components/profile';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';

// Import the new MobileAppSettings component
import MobileAppSettings from './MobileAppSettings';

const ProfileTabs: React.FC = () => {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="space-y-4">
        <AccountTabContent />
      </TabsContent>
      <TabsContent value="security" className="space-y-4">
        <SecurityTabContent />
      </TabsContent>
      <TabsContent value="settings">
        <SettingsTabContent />
      </TabsContent>
    </Tabs>
  );
};

const AccountTabContent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <AccountInformation />
    </motion.div>
  );
};

const SecurityTabContent: React.FC = () => {
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 py-4"
    >
      <SecuritySettings onChangePassword={() => setShowChangePasswordDialog(true)} />
      <ChangePasswordDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
      />
    </motion.div>
  );
};

// Add the MobileAppSettings component to the Settings tab content
const SettingsTabContent = () => {
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const { settings, isLoading, updateSettings, resetToDefaults } = useNotificationSettings();

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
      
      <SecuritySettings onChangePassword={() => setShowChangePasswordDialog(true)} />
      
      <NotificationPreferences
        settings={settings}
        isLoading={isLoading}
        onSettingChange={updateSettings}
        onResetDefaults={resetToDefaults}
      />
      
      <ChangePasswordDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
      />
    </motion.div>
  );
};

export default ProfileTabs;
