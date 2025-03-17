
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Shield, ChartBar } from 'lucide-react';
import AccountInformation from './AccountInformation';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import TransactionPinSettings from './TransactionPinSettings';
import MobileAppSettings from './MobileAppSettings';
import TransactionLimits from './TransactionLimits';
import ActivityAnalytics from './ActivityAnalytics';

interface ProfileTabsProps {
  user: any;
  onEditField: (field: string, value: string) => void;
  onChangePassword: () => void;
  notificationSettings: any;
  notificationsLoading: boolean;
  onNotificationChange: (key: string, checked: boolean) => void;
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
  const [activeTab, setActiveTab] = useState('account');
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="account" className="flex items-center">
          <User className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Account</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center">
          <ChartBar className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Activity</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="account" className="space-y-6">
        <AccountInformation 
          user={user}
          onEdit={onEditField}
        />
        <MobileAppSettings />
      </TabsContent>
      
      <TabsContent value="security" className="space-y-6">
        <SecuritySettings 
          onChangePassword={onChangePassword}
        />
        <TransactionPinSettings />
        <TransactionLimits />
      </TabsContent>
      
      <TabsContent value="notifications" className="space-y-6">
        <NotificationSettings
          settings={notificationSettings}
          isLoading={notificationsLoading}
          onChange={onNotificationChange}
          onReset={onResetNotifications}
        />
      </TabsContent>
      
      <TabsContent value="activity" className="space-y-6">
        <ActivityAnalytics userId={user.id} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
