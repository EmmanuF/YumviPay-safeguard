
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BottomNavigation from '@/components/BottomNavigation';
import { getAuthState, logoutUser } from '@/services/auth';
import { toast } from '@/hooks/use-toast';

import {
  ProfileHeader,
  AccountInformation,
  SecuritySettings,
  NotificationPreferences,
  EditProfileDialog
} from '@/components/profile';

import { useNotificationSettings } from '@/hooks/useNotificationSettings';

const Profile = () => {
  const navigate = useNavigate();
  const { 
    settings: notificationSettings, 
    loading: notificationsLoading, 
    updateSetting: updateNotificationSetting,
    resetSettings: resetNotificationSettings
  } = useNotificationSettings();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data for profile page');
        const authState = await getAuthState();
        
        if (!authState.isAuthenticated) {
          console.log('User not authenticated, creating mock user for demo');
          // For demo purposes, create a mock user if not authenticated
          setUser({
            id: 'mock-user-1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 234 567 8901',
            country: 'Cameroon',
          });
        } else {
          console.log('User authenticated:', authState.user);
          setUser(authState.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to mock user for demo
        setUser({
          id: 'mock-user-1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 234 567 8901',
          country: 'Cameroon',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully"
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (field: string, value: string) => {
    setEditField(field);
    setEditValue(value);
    setEditDialogOpen(true);
  };

  const handleEditValueChange = (value: string) => {
    setEditValue(value);
  };

  const saveChanges = () => {
    if (user && editField) {
      const updatedUser = { ...user, [editField]: editValue };
      setUser(updatedUser);
      toast({
        title: "Success",
        description: `${editField.charAt(0).toUpperCase() + editField.slice(1)} updated successfully`
      });
      setEditDialogOpen(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-16">
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
            
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-4">
                <AccountInformation user={user} onEdit={openEditDialog} />
                <SecuritySettings onChangePassword={() => openEditDialog('password', '')} />
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
            
            {/* Logout Button */}
            <Button 
              variant="outline" 
              className="w-full mt-4 border-destructive text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </motion.div>
        )}
      </main>
      
      <BottomNavigation />
      
      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        field={editField}
        value={editValue}
        onChange={handleEditValueChange}
        onSave={saveChanges}
      />
    </div>
  );
};

export default Profile;
