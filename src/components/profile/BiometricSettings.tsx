
import React from 'react';
import { Fingerprint } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { useBiometricAuth } from '@/services/biometric';
import { useAuth } from '@/contexts/AuthContext';

const BiometricSettings: React.FC = () => {
  const { isAvailable, isEnabled, isLoading, enableBiometrics, disableBiometrics } = useBiometricAuth();
  const { user } = useAuth();

  const handleToggleBiometric = async (checked: boolean) => {
    try {
      if (checked) {
        // Only proceed if we have a user email (as username)
        if (!user?.email) {
          toast({
            title: "Authentication required",
            description: "Please log in again to enable biometric authentication",
            variant: "destructive"
          });
          return;
        }

        // For security, we would normally prompt for the password here
        // But for demo purposes, we'll use a placeholder
        // In a real app, you'd show a password dialog here
        const success = await enableBiometrics(user.email, "placeholder-for-demo");
        
        if (success) {
          toast({
            title: "Biometric authentication enabled",
            description: "You can now use fingerprint or face ID to authenticate",
          });
        } else {
          toast({
            title: "Could not enable biometrics",
            description: "There was an error setting up biometric authentication",
            variant: "destructive"
          });
        }
      } else {
        // Disable biometrics
        const success = await disableBiometrics();
        
        if (success) {
          toast({
            title: "Biometric authentication disabled",
            description: "You will no longer use biometric authentication",
          });
        } else {
          toast({
            title: "Could not disable biometrics",
            description: "There was an error disabling biometric authentication",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error toggling biometric authentication:', error);
      toast({
        title: "Failed to update settings",
        description: "Could not change biometric authentication settings",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between py-2 opacity-50">
        <div className="flex items-center">
          <Fingerprint className="text-primary-500" />
          <div className="ml-3">
            <p className="text-sm font-medium">Biometric Authentication</p>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Switch disabled checked={false} />
      </div>
    );
  }

  if (!isAvailable) {
    return null; // Don't show the option if biometrics aren't available
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        <Fingerprint className="text-primary-500" />
        <div className="ml-3">
          <p className="text-sm font-medium">Biometric Authentication</p>
          <p className="text-sm text-muted-foreground">
            Use Touch ID or Face ID for login
          </p>
        </div>
      </div>
      <Switch 
        checked={isEnabled} 
        onCheckedChange={handleToggleBiometric}
      />
    </div>
  );
};

export default BiometricSettings;
