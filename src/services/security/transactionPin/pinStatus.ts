
import { Preferences } from '@capacitor/preferences';
import { PinStatus } from './types';
import { 
  TRANSACTION_PIN_KEY, 
  PIN_VERIFICATION_ATTEMPTS_KEY,
  PIN_LOCKOUT_TIME_KEY,
  MAX_PIN_ATTEMPTS 
} from './constants';

/**
 * Check if a transaction PIN has been set
 */
export const isPinSet = async (): Promise<boolean> => {
  try {
    const { value } = await Preferences.get({ key: TRANSACTION_PIN_KEY });
    return !!value;
  } catch (error) {
    console.error('Error checking if PIN is set:', error);
    return false;
  }
};

/**
 * Check if PIN verification is locked out
 */
export const isPinLocked = async (): Promise<{ isLocked: boolean; timeRemaining: number | null }> => {
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

/**
 * Get current PIN status
 */
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
