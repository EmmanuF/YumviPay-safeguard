
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BiometricService } from '@/services/biometric';
import { useToast } from '@/components/ui/use-toast';

const BiometricLogin: React.FC = () => {
  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkBiometricStatus = async () => {
      try {
        const isAvailable = await BiometricService.isAvailable();
        setAvailable(isAvailable);
        
        if (isAvailable) {
          const isEnabled = await BiometricService.isEnabled();
          setEnabled(isEnabled);
        }
      } catch (error) {
        console.error('Error checking biometric status:', error);
      }
    };
    
    checkBiometricStatus();
  }, []);

  const handleBiometricLogin = async () => {
    try {
      setLoading(true);
      
      // Simulate biometric authentication
      const authenticated = await BiometricService.authenticate();
      
      if (!authenticated) {
        toast({
          title: "Authentication failed",
          description: "Biometric authentication was unsuccessful.",
          variant: "destructive",
        });
        return;
      }
      
      // Get stored credentials
      const credentials = await BiometricService.getCredentials();
      
      if (!credentials) {
        toast({
          title: "No stored credentials",
          description: "Please sign in with email and password first.",
          variant: "destructive",
        });
        return;
      }
      
      // Sign in with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in with biometrics.",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during biometric sign in.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!available || !enabled) {
    return null;
  }

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center space-x-2 my-4"
      onClick={handleBiometricLogin}
      disabled={loading}
    >
      <Fingerprint className="h-5 w-5" />
      <span>{loading ? "Authenticating..." : "Sign in with Biometrics"}</span>
    </Button>
  );
};

export default BiometricLogin;
