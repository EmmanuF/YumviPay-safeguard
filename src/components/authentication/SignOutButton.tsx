
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SignOutButtonProps extends Omit<ButtonProps, 'onClick'> {
  redirectTo?: string;
  iconOnly?: boolean;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ 
  redirectTo = '/',
  iconOnly = false,
  children,
  ...props
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account"
      });
      navigate(redirectTo);
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSignOut}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
      {...props}
    >
      {children || (
        <>
          <LogOut className={`${iconOnly ? '' : 'mr-2'} h-4 w-4`} />
          {!iconOnly && "Sign Out"}
        </>
      )}
    </Button>
  );
};

export default SignOutButton;
