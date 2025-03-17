
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import PageTransition from '@/components/PageTransition';

import {
  ProfileHeader,
  EditProfileDialog,
  ProfileTabs,
  LogoutButton,
  ProfileLoading,
  BiometricSettings
} from '@/components/profile';

import { useProfile } from '@/hooks/useProfile';
import { useProfileNotifications } from '@/hooks/useProfileNotifications';

const Profile = () => {
  const {
    user,
    loading,
    editDialogOpen,
    setEditDialogOpen,
    editField,
    editValue,
    handleLogout,
    openEditDialog,
    handleEditValueChange,
    saveChanges
  } = useProfile();

  const {
    notificationSettings,
    notificationsLoading,
    handleNotificationChange,
    handleResetNotifications
  } = useProfileNotifications();

  if (loading) {
    return <ProfileLoading />;
  }

  return (
    <PageTransition>
      <div className="flex flex-col">
        <Header title="Profile" showBackButton />
        
        <main className="flex-1 p-4">
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <ProfileHeader name={user.name} email={user.email} />
              
              <ProfileTabs 
                user={user}
                onEditField={openEditDialog}
                onChangePassword={() => openEditDialog('password', '')}
                notificationSettings={notificationSettings}
                notificationsLoading={notificationsLoading}
                onNotificationChange={handleNotificationChange}
                onResetNotifications={handleResetNotifications}
              />
              
              <LogoutButton onLogout={handleLogout} />
            </motion.div>
          )}
        </main>
      </div>
      
      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        field={editField}
        value={editValue}
        onChange={handleEditValueChange}
        onSave={saveChanges}
      />
    </PageTransition>
  );
};

export default Profile;
