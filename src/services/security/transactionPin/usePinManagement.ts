
import { useState, useCallback, useEffect } from 'react';
import { 
  verifyPin,
  setTransactionPin,
  changePin as changePinService,
  resetPinWithBiometrics as resetPinWithBiometricsService,
  removePin as removePinService,
  getPinStatus
} from './index';
import type { PinStatus } from './types';

/**
 * Custom hook for managing the transaction PIN within React components
 */
export function usePinManagement() {
  const [pinStatus, setPinStatus] = useState<PinStatus>({
    isSet: false,
    isLocked: false,
    remainingAttempts: 5,
    lockoutTimeRemaining: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial PIN status
  const loadPinStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const status = await getPinStatus();
      setPinStatus(status);
    } catch (err) {
      console.error('Error loading PIN status:', err);
      setError('Failed to load PIN status');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load PIN status on component mount
  useEffect(() => {
    loadPinStatus();
  }, [loadPinStatus]);

  // Verify PIN
  const verifyUserPin = useCallback(async (pin: string): Promise<boolean> => {
    setError(null);
    try {
      const isValid = await verifyPin(pin);
      // Refresh PIN status after verification attempt
      await loadPinStatus();
      return isValid;
    } catch (err) {
      console.error('Error verifying PIN:', err);
      setError('Failed to verify PIN');
      return false;
    }
  }, [loadPinStatus]);

  // Set PIN
  const createPin = useCallback(async (pin: string): Promise<boolean> => {
    setError(null);
    try {
      const result = await setTransactionPin(pin);
      if (result) {
        await loadPinStatus();
      }
      return result;
    } catch (err) {
      console.error('Error setting PIN:', err);
      setError('Failed to set PIN');
      return false;
    }
  }, [loadPinStatus]);

  // Change PIN
  const changePin = useCallback(async (currentPin: string, newPin: string): Promise<boolean> => {
    setError(null);
    try {
      const result = await changePinService(currentPin, newPin);
      if (result) {
        await loadPinStatus();
      }
      return result;
    } catch (err) {
      console.error('Error changing PIN:', err);
      setError('Failed to change PIN');
      return false;
    }
  }, [loadPinStatus]);

  // Reset PIN with biometrics
  const resetPinWithBiometrics = useCallback(async (newPin: string): Promise<boolean> => {
    setError(null);
    try {
      const result = await resetPinWithBiometricsService(newPin);
      if (result) {
        await loadPinStatus();
      }
      return result;
    } catch (err) {
      console.error('Error resetting PIN with biometrics:', err);
      setError('Failed to reset PIN');
      return false;
    }
  }, [loadPinStatus]);

  // Remove PIN
  const removePin = useCallback(async (): Promise<boolean> => {
    setError(null);
    try {
      const result = await removePinService();
      if (result) {
        await loadPinStatus();
      }
      return result;
    } catch (err) {
      console.error('Error removing PIN:', err);
      setError('Failed to remove PIN');
      return false;
    }
  }, [loadPinStatus]);

  return {
    pinStatus,
    isLoading,
    error,
    verifyPin: verifyUserPin,
    setPin: createPin,
    changePin,
    resetPinWithBiometrics,
    removePin,
    refreshPinStatus: loadPinStatus
  };
}
