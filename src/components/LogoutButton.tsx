
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
      size="icon"
      className="fixed bottom-8 left-8 z-50 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-gray-200 hover:bg-primary-50"
      onClick={handleLogout}
      title="Logout"
    >
      <LogOut className="h-5 w-5 text-primary" />
    </Button>
  );
};

export default LogoutButton;
