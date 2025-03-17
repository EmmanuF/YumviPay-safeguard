
import { useState, useEffect } from 'react';
import { BiometricService } from './biometricService';
import { BiometricAuthHook, BiometricCredentials } from './types';

/**
 * Custom hook for biometric authentication
 */
export const useBiometricAuth = (): BiometricAuthHook => {
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

  const enableBiometrics = async (username: string, password: string): Promise<boolean> => {
    try {
      if (!isAvailable) return false;
      
      await BiometricService.storeCredentials(username, password);
      setIsEnabled(true);
      return true;
    } catch (error) {
      console.error('Error enabling biometrics:', error);
      return false;
    }
  };

  const disableBiometrics = async (): Promise<boolean> => {
    try {
      await BiometricService.clearCredentials();
      setIsEnabled(false);
      return true;
    } catch (error) {
      console.error('Error disabling biometrics:', error);
      return false;
    }
  };

  return {
    isAvailable,
    isEnabled,
    isLoading,
    enableBiometrics,
    disableBiometrics,
    authenticate: BiometricService.authenticate,
    getCredentials: BiometricService.getStoredCredentials
  };
};
