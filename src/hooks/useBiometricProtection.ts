import { useState, useCallback } from 'react';
import { BiometricService } from '@/services/biometric';
import { useToast } from '@/hooks/toast/use-toast';

interface UseBiometricProtectionOptions {
  onSuccess?: () => void;
  onFailure?: () => void;
  promptMessage?: string;
}

/**
 * Hook for protecting sensitive operations with biometric authentication
 */
export const useBiometricProtection = (options: UseBiometricProtectionOptions = {}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Check if biometric authentication is available
  const checkAvailability = useCallback(async () => {
    try {
      const available = await BiometricService.isAvailable();
      const enabled = available ? await BiometricService.isEnabled() : false;
      setIsAvailable(available && enabled);
      return available && enabled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsAvailable(false);
      return false;
    }
  }, []);

  // Protect a sensitive operation with biometric authentication
  const protectOperation = useCallback(async (operation: () => Promise<void> | void) => {
    const { onSuccess, onFailure, promptMessage } = options;
    
    setIsVerifying(true);
    
    try {
      // First check if biometrics are available and enabled
      const isEnabled = await checkAvailability();
      
      if (!isEnabled) {
        // If biometrics are not available or not enabled, proceed without biometric verification
        await operation();
        if (onSuccess) onSuccess();
        return true;
      }
      
      // Verify with biometrics
      const isAuthenticated = await BiometricService.authenticate();
      
      if (isAuthenticated) {
        // Execute the protected operation
        await operation();
        if (onSuccess) onSuccess();
        toast({
          title: "Verified",
          description: "Biometric verification successful",
        });
        return true;
      } else {
        if (onFailure) onFailure();
        toast({
          title: "Verification Failed",
          description: "Biometric verification was unsuccessful",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error during biometric verification:', error);
      if (onFailure) onFailure();
      toast({
        title: "Verification Error",
        description: "An error occurred during biometric verification",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [options, checkAvailability, toast]);

  return {
    isVerifying,
    isAvailable,
    checkAvailability,
    protectOperation
  };
};
