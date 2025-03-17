
import { Preferences } from '@capacitor/preferences';
import { isPinLocked } from './pinStatus';
import { hashPin } from './utils';
import { 
  TRANSACTION_PIN_KEY,
  PIN_VERIFICATION_ATTEMPTS_KEY,
  PIN_LOCKOUT_TIME_KEY,
  MAX_PIN_ATTEMPTS,
  LOCKOUT_DURATION_MS
} from './constants';

/**
 * Record a failed attempt and check if we should lock
 */
export const recordFailedAttempt = async (): Promise<void> => {
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

/**
 * Verify the transaction PIN
 */
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
