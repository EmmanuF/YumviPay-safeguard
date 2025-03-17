
import * as crypto from 'crypto-js';

/**
 * Hash the PIN before storing
 */
export const hashPin = (pin: string): string => {
  return crypto.SHA256(pin).toString();
};
