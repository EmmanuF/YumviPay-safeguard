
import { BiometricService } from '@/services/biometric';
import { toast } from '@/hooks/use-toast';

/**
 * Performs biometric authentication for high-value transactions
 * @param amount Transaction amount
 * @returns Promise resolving to boolean indicating authentication success
 */
export const performBiometricCheck = async (amount: string): Promise<boolean> => {
  if (parseFloat(amount) <= 100) {
    // No need for biometric check for low-value transactions
    return true;
  }
  
  try {
    const isAvailable = await BiometricService.isAvailable();
    const isEnabled = await BiometricService.isEnabled();
    
    if (isAvailable && isEnabled) {
      const authenticated = await BiometricService.authenticate();
      if (!authenticated) {
        toast({
          title: "Authentication Required",
          description: "Biometric verification failed. Please try again.",
          variant: "destructive"
        });
        return false;
      }
      return true;
    }
    
    // If biometrics not available/enabled, allow to proceed
    return true;
  } catch (bioError) {
    console.error('❓ Biometric authentication error:', bioError);
    // Continue without biometric auth if there's an error
    return true;
  }
};
