
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Shield, Bell, LogOut } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import BottomNavigation from '@/components/BottomNavigation';
import { getAuthState, logoutUser } from '@/services/auth';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [notifications, setNotifications] = useState({
    transactions: true,
    marketing: false,
    updates: true,
  });

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
            country: 'United States',
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
          country: 'United States',
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
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const openEditDialog = (field: string, value: string) => {
    setEditField(field);
    setEditValue(value);
    setEditDialogOpen(true);
  };

  const saveChanges = () => {
    if (user && editField) {
      const updatedUser = { ...user, [editField]: editValue };
      setUser(updatedUser);
      toast.success(`${editField.charAt(0).toUpperCase() + editField.slice(1)} updated successfully`);
      setEditDialogOpen(false);
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'name': return <User className="text-primary-500" />;
      case 'email': return <Mail className="text-primary-500" />;
      case 'phone': return <Phone className="text-primary-500" />;
      case 'country': return <MapPin className="text-primary-500" />;
      default: return <User className="text-primary-500" />;
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
            {/* User Profile Card */}
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center pb-2">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 mr-4">
                  <User size={32} />
                </div>
                <div>
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </CardHeader>
            </Card>
            
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-4">
                {/* Account Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {['name', 'email', 'phone', 'country'].map((field) => (
                      <div key={field} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center">
                          {getFieldIcon(field)}
                          <div className="ml-3">
                            <p className="text-sm font-medium capitalize">{field}</p>
                            <p className="text-sm text-muted-foreground">{user[field]}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(field, user[field])}>
                          Edit
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                {/* Security */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Shield className="text-primary-500" />
                        <div className="ml-3">
                          <p className="text-sm font-medium">Password</p>
                          <p className="text-sm text-muted-foreground">Change your password</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog('password', '')}>
                        Change
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-4">
                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="transaction-notifications">Transaction alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications about your transactions</p>
                      </div>
                      <Switch
                        id="transaction-notifications"
                        checked={notifications.transactions}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, transactions: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing-notifications">Marketing emails</Label>
                        <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                      </div>
                      <Switch
                        id="marketing-notifications"
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="update-notifications">App updates</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications about app updates</p>
                      </div>
                      <Switch
                        id="update-notifications"
                        checked={notifications.updates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
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
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editField && editField.charAt(0).toUpperCase() + editField.slice(1)}</DialogTitle>
            <DialogDescription>
              Update your {editField} information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="edit-field" className="text-right">
              {editField && editField.charAt(0).toUpperCase() + editField.slice(1)}
            </Label>
            <Input
              id="edit-field"
              type={editField === 'email' ? 'email' : editField === 'phone' ? 'tel' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveChanges}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
