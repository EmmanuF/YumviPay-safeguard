
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Edit2, Lock, Bell, MapPin, Shield, CircleDollarSign } from 'lucide-react';
import { 
  AccountInformation, 
  SecuritySettings, 
  NotificationSettings,
  CountryPreferences,
  TransactionLimits,
  ReferralLink,
  AccountDeletion
} from '@/components/profile';

interface ProfileTabsProps {
  user: any;
  onEditField: (field: string, value: string) => void;
  onChangePassword: () => void;
  notificationSettings: any;
  notificationsLoading: boolean;
  onNotificationChange: (key: string, value: boolean) => void;
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
    <Tabs 
      defaultValue="account" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>
      
      <TabsContent value="account" className="space-y-4 mt-0">
        <Card>
          <AccountInformation 
            user={user}
            onEdit={onEditField}
          />
          
          {/* Add Referral Link in the Account tab */}
          <ReferralLink />
          
          {/* Add Account Deletion at the bottom of the Account tab */}
          <AccountDeletion />
        </Card>
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4 mt-0">
        <Card>
          <SecuritySettings 
            onChangePassword={onChangePassword}
          />
        </Card>
      </TabsContent>
      
      <TabsContent value="preferences" className="space-y-4 mt-0">
        <Card>
          <NotificationSettings 
            settings={notificationSettings}
            isLoading={notificationsLoading}
            onChange={onNotificationChange}
            onReset={onResetNotifications}
          />
          
          <CountryPreferences />
          
          <TransactionLimits />
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
