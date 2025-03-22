
import React from 'react';
import { Button } from '@/components/ui/button';
import { Fingerprint } from 'lucide-react';
import { useBiometricAuth } from '@/services/biometric';
import { toast } from '@/hooks/toast/use-toast';

interface BiometricLoginProps {
  onSuccess: (credentials: { username: string; password: string }) => void;
}

const BiometricLogin: React.FC<BiometricLoginProps> = ({ onSuccess }) => {
  const { isAvailable, isEnabled, isLoading, authenticate, getCredentials } = useBiometricAuth();
  const [authenticating, setAuthenticating] = React.useState(false);

  const handleBiometricLogin = async () => {
    if (authenticating) return;
    
    try {
      setAuthenticating(true);
      
      const isAuthenticated = await authenticate();
      
      if (isAuthenticated) {
        const credentials = await getCredentials();
        
        if (credentials) {
          onSuccess(credentials);
        } else {
          toast.warning(
            "No stored credentials",
            { description: "Please login with your username and password first" }
          );
        }
      } else {
        toast.error(
          "Authentication failed",
          { description: "Biometric verification was unsuccessful" }
        );
      }
    } catch (error) {
      console.error('Error during biometric login:', error);
      toast.error(
        "Authentication error",
        { description: "An error occurred during biometric authentication" }
      );
    } finally {
      setAuthenticating(false);
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
      disabled={authenticating}
    >
      <Fingerprint className="mr-2" />
      {authenticating ? "Authenticating..." : "Login with Biometrics"}
    </Button>
  );
};

export default BiometricLogin;
