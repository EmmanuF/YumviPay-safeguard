
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from 'capacitor-native-biometric';
import * as crypto from 'crypto-js';

// Key for storing the hashed PIN
const TRANSACTION_PIN_KEY = 'transaction_pin';
const PIN_VERIFICATION_ATTEMPTS_KEY = 'pin_verification_attempts';
const PIN_LOCKOUT_TIME_KEY = 'pin_lockout_time';
const MAX_PIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

export interface PinStatus {
  isSet: boolean;
  isLocked: boolean;
  remainingAttempts: number;
  lockoutTimeRemaining: number | null;
}

// Hash the PIN before storing
const hashPin = (pin: string): string => {
  return crypto.SHA256(pin).toString();
};

// Set a transaction PIN
export const setTransactionPin = async (pin: string): Promise<boolean> => {
  try {
    const hashedPin = hashPin(pin);
    
    await Preferences.set({
      key: TRANSACTION_PIN_KEY,
      value: hashedPin,
    });
    
    // Reset attempts when setting a new PIN
    await Preferences.set({
      key: PIN_VERIFICATION_ATTEMPTS_KEY,
      value: '0',
    });
    
    return true;
  } catch (error) {
    console.error('Error setting transaction PIN:', error);
    return false;
  }
};

// Check if a transaction PIN has been set
export const isPinSet = async (): Promise<boolean> => {
  try {
    const { value } = await Preferences.get({ key: TRANSACTION_PIN_KEY });
    return !!value;
  } catch (error) {
    console.error('Error checking if PIN is set:', error);
    return false;
  }
};

// Check if PIN verification is locked out
const isPinLocked = async (): Promise<{ isLocked: boolean; timeRemaining: number | null }> => {
  try {
    const { value: lockoutTimeStr } = await Preferences.get({ key: PIN_LOCKOUT_TIME_KEY });
    
    if (!lockoutTimeStr) {
      return { isLocked: false, timeRemaining: null };
    }
    
    const lockoutTime = parseInt(lockoutTimeStr, 10);
    const currentTime = Date.now();
    const timeRemaining = lockoutTime - currentTime;
    
    if (timeRemaining <= 0) {
      // Lockout period has expired, reset attempts
      await Preferences.set({
        key: PIN_VERIFICATION_ATTEMPTS_KEY,
        value: '0',
      });
      await Preferences.remove({ key: PIN_LOCKOUT_TIME_KEY });
      return { isLocked: false, timeRemaining: null };
    }
    
    return { isLocked: true, timeRemaining };
  } catch (error) {
    console.error('Error checking PIN lockout:', error);
    return { isLocked: false, timeRemaining: null };
  }
};

// Get current PIN status
export const getPinStatus = async (): Promise<PinStatus> => {
  try {
    const pinIsSet = await isPinSet();
    const { isLocked, timeRemaining } = await isPinLocked();
    
    let remainingAttempts = MAX_PIN_ATTEMPTS;
    if (pinIsSet && !isLocked) {
      const { value: attemptsStr } = await Preferences.get({ key: PIN_VERIFICATION_ATTEMPTS_KEY });
      const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;
      remainingAttempts = MAX_PIN_ATTEMPTS - attempts;
    }
    
    return {
      isSet: pinIsSet,
      isLocked,
      remainingAttempts,
      lockoutTimeRemaining: timeRemaining,
    };
  } catch (error) {
    console.error('Error getting PIN status:', error);
    return {
      isSet: false,
      isLocked: false,
      remainingAttempts: MAX_PIN_ATTEMPTS,
      lockoutTimeRemaining: null,
    };
  }
};

// Record a failed attempt and check if we should lock
const recordFailedAttempt = async (): Promise<void> => {
  try {
    const { value: attemptsStr } = await Preferences.get({ key: PIN_VERIFICATION_ATTEMPTS_KEY });
    const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;
    const newAttempts = attempts + 1;
    
    await Preferences.set({
      key: PIN_VERIFICATION_ATTEMPTS_KEY,
      value: newAttempts.toString(),
    });
    
    // Lock PIN verification if max attempts reached
    if (newAttempts >= MAX_PIN_ATTEMPTS) {
      const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
      await Preferences.set({
        key: PIN_LOCKOUT_TIME_KEY,
        value: lockoutTime.toString(),
      });
    }
  } catch (error) {
    console.error('Error recording failed attempt:', error);
  }
};

// Verify the transaction PIN
export const verifyPin = async (pin: string): Promise<boolean> => {
  try {
    // Check if PIN verification is locked
    const { isLocked } = await isPinLocked();
    if (isLocked) {
      return false;
    }
    
    // Get the stored PIN hash
    const { value: storedHashedPin } = await Preferences.get({ key: TRANSACTION_PIN_KEY });
    if (!storedHashedPin) {
      return false;
    }
    
    // Verify the PIN
    const hashedInputPin = hashPin(pin);
    const isPinCorrect = hashedInputPin === storedHashedPin;
    
    if (isPinCorrect) {
      // Reset attempts on successful verification
      await Preferences.set({
        key: PIN_VERIFICATION_ATTEMPTS_KEY,
        value: '0',
      });
      return true;
    } else {
      // Record a failed attempt
      await recordFailedAttempt();
      return false;
    }
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return false;
  }
};

// Change the transaction PIN
export const changePin = async (currentPin: string, newPin: string): Promise<boolean> => {
  try {
    const isPinValid = await verifyPin(currentPin);
    if (!isPinValid) {
      return false;
    }
    
    return await setTransactionPin(newPin);
  } catch (error) {
    console.error('Error changing PIN:', error);
    return false;
  }
};

// Reset the transaction PIN using biometric authentication as a fallback
export const resetPinWithBiometrics = async (newPin: string): Promise<boolean> => {
  try {
    // First verify with biometrics
    const result = await NativeBiometric.verifyIdentity({
      reason: 'Reset your transaction PIN',
      title: 'Biometric Authentication',
      subtitle: 'Use your fingerprint or face to authenticate',
    });
    
    // NativeBiometric.verifyIdentity throws an error if authentication fails
    // If we reach here, authentication was successful
    
    // Set the new PIN
    return await setTransactionPin(newPin);
  } catch (error) {
    console.error('Error resetting PIN with biometrics:', error);
    return false;
  }
};

// Remove the transaction PIN
export const removePin = async (): Promise<boolean> => {
  try {
    await Preferences.remove({ key: TRANSACTION_PIN_KEY });
    await Preferences.remove({ key: PIN_VERIFICATION_ATTEMPTS_KEY });
    await Preferences.remove({ key: PIN_LOCKOUT_TIME_KEY });
    return true;
  } catch (error) {
    console.error('Error removing PIN:', error);
    return false;
  }
};
