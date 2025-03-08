
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, CreditCard, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getAuthState, logoutUser } from '@/services/auth';

interface SettingsOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action: () => void;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authState = await getAuthState();
        if (!authState.isAuthenticated) {
          navigate('/');
          return;
        }
        setUser(authState.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const settingsOptions: SettingsOption[] = [
    {
      id: 'account',
      icon: <User className="text-primary-500" />,
      title: 'Account Information',
      description: 'Manage your personal information',
      action: () => toast.info('Account settings coming soon')
    },
    {
      id: 'security',
      icon: <Shield className="text-primary-500" />,
      title: 'Security',
      description: 'Password and security settings',
      action: () => toast.info('Security settings coming soon')
    },
    {
      id: 'payment',
      icon: <CreditCard className="text-primary-500" />,
      title: 'Payment Methods',
      description: 'Manage your payment options',
      action: () => toast.info('Payment methods coming soon')
    },
    {
      id: 'notifications',
      icon: <Bell className="text-primary-500" />,
      title: 'Notifications',
      description: 'Configure your notification preferences',
      action: () => toast.info('Notification settings coming soon')
    },
    {
      id: 'help',
      icon: <HelpCircle className="text-primary-500" />,
      title: 'Help & Support',
      description: 'Get help with any issues',
      action: () => toast.info('Help center coming soon')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Profile" showBackButton />
      
      <main className="container px-4 pb-24">
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-primary-100 h-32 relative"></div>
                <div className="px-4 pb-4 -mt-12">
                  <div className="w-24 h-24 rounded-full bg-white shadow-md border-4 border-white flex items-center justify-center text-primary-500 mb-3">
                    <User size={40} />
                  </div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="text-gray-500">{user.phone}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="font-medium text-lg mb-2">Settings</h3>
          
          {settingsOptions.map((option) => (
            <motion.div
              key={option.id}
              whileTap={{ scale: 0.98 }}
              onClick={option.action}
              className="bg-card rounded-lg p-4 flex items-center cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary-50/50 flex items-center justify-center mr-4">
                {option.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{option.title}</h4>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
              <Settings className="w-5 h-5 text-gray-400" />
            </motion.div>
          ))}

          <Separator className="my-6" />
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>
        </motion.div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
