
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      toast({
        title: "Signing out...",
        description: "Please wait while we sign you out.",
      });
      
      await signOut();
      
      toast({
        title: "Sign out successful",
        description: "You have been signed out successfully.",
        variant: "success",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full mt-4 border-destructive text-destructive hover:bg-destructive/10"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
