
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from 'capacitor-native-biometric';
import { hashPin } from './utils';
import { verifyPin } from './pinVerification';
import { 
  TRANSACTION_PIN_KEY,
  PIN_VERIFICATION_ATTEMPTS_KEY,
  PIN_LOCKOUT_TIME_KEY 
} from './constants';

/**
 * Set a transaction PIN
 */
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

/**
 * Change the transaction PIN
 */
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

/**
 * Reset the transaction PIN using biometric authentication as a fallback
 */
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

/**
 * Remove the transaction PIN
 */
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
