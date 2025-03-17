
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Fingerprint } from 'lucide-react';
import { BiometricService } from '@/services/biometric';
import { toast } from '@/hooks/use-toast';

interface BiometricLoginProps {
  onSuccess: (credentials: { username: string; password: string }) => void;
}

const BiometricLogin: React.FC<BiometricLoginProps> = ({ onSuccess }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBiometricStatus = async () => {
      try {
        setIsLoading(true);
        const available = await BiometricService.isAvailable();
        setIsAvailable(available);
        
        if (available) {
          const enabled = await BiometricService.isEnabled();
          setIsEnabled(enabled);
        }
      } catch (error) {
        console.error('Error checking biometric status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkBiometricStatus();
  }, []);

  const handleBiometricLogin = async () => {
    try {
      setIsLoading(true);
      
      const isAuthenticated = await BiometricService.authenticate();
      
      if (isAuthenticated) {
        const credentials = await BiometricService.getStoredCredentials();
        
        if (credentials) {
          onSuccess(credentials);
        } else {
          toast({
            title: "No stored credentials",
            description: "Please login with your username and password first",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Authentication failed",
          description: "Biometric verification was unsuccessful",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during biometric login:', error);
      toast({
        title: "Authentication error",
        description: "An error occurred during biometric authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAvailable || !isEnabled || isLoading) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full mb-4 flex items-center justify-center"
      onClick={handleBiometricLogin}
      disabled={isLoading}
    >
      <Fingerprint className="mr-2" />
      {isLoading ? "Authenticating..." : "Login with Biometrics"}
    </Button>
  );
};

export default BiometricLogin;
