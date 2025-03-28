
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/toast/use-toast';

export const useProfile = () => {
  const navigate = useNavigate();
  const { user: authUser, isLoggedIn } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        console.log('Initializing profile with auth state', { isLoggedIn, authUser });
        
        if (isLoggedIn && authUser) {
          console.log('Using authenticated user data for profile');
          setUser(authUser);
        } else {
          console.log('No authenticated user, using mock data for demo');
          // For demo purposes, create a mock user if not authenticated
          setUser({
            id: 'mock-user-1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 234 567 8901',
            country: 'Cameroon',
          });
        }
      } catch (error) {
        console.error('Error initializing profile data:', error);
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
    
    initializeProfile();
  }, [authUser, isLoggedIn, navigate]);

  const handleLogout = async () => {
    try {
      // Create a loading toast
      const loadingToast = toast({
        title: "Logging out...",
        variant: "default"
      });
      
      try {
        const { signOut } = useAuth();
        await signOut();
        
        // Dismiss the loading toast and show success
        loadingToast.dismiss();
        toast({
          title: "Success",
          description: "Logged out successfully",
          variant: "success"
        });
        
        navigate('/');
      } catch (error) {
        // Dismiss the loading toast and show error
        loadingToast.dismiss();
        toast({
          title: "Error",
          description: "Failed to log out",
          variant: "destructive"
        });
        console.error('Error logging out:', error);
      }
    } catch (error) {
      console.error('Error during logout process:', error);
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
