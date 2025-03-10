
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
  EditProfileDialog,
  ChangePasswordDialog,
  ProfileContent
} from '@/components/profile';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

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
            
            <ProfileContent 
              user={user}
              onEdit={openEditDialog}
              onChangePassword={() => setPasswordDialogOpen(true)}
            />
            
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

      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      />
    </div>
  );
};

export default Profile;
