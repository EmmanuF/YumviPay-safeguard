import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthState, logoutUser } from '@/services/auth';
import { toast } from '@/hooks/toast/use-toast';

export const useProfile = () => {
  const navigate = useNavigate();
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

  return {
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
  };
};
