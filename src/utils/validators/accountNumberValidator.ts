
import { getProviderById } from '@/data/cameroonPaymentProviders';

/**
 * Validates account numbers based on the type and country
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Validates a mobile money number for Cameroon
 */
export const validateCameroonMobileNumber = (
  number: string, 
  providerId?: string
): ValidationResult => {
  const cleanedNumber = number.replace(/\s/g, '').replace(/^\+237/, '').replace(/^237/, '');
  
  // Check basic format first - must be 9 digits starting with 6
  if (!/^6[0-9]{8}$/.test(cleanedNumber)) {
    if (cleanedNumber.length !== 9) {
      return {
        isValid: false,
        message: 'Cameroon mobile numbers must have 9 digits after the country code'
      };
    } 
    
    if (!/^6/.test(cleanedNumber)) {
      return {
        isValid: false,
        message: 'Cameroon mobile numbers must start with 6 after the country code'
      };
    }
    
    return {
      isValid: false,
      message: 'Invalid Cameroon mobile number format'
    };
  }
  
  // Check provider-specific validation if a provider is specified
  if (providerId) {
    // Check MTN provider
    if (providerId === 'mtn_momo') {
      const prefix = cleanedNumber.substring(0, 2);
      if (!['67', '68', '65', '66'].includes(prefix)) {
        return {
          isValid: false,
          message: 'This doesn\'t appear to be an MTN number. MTN numbers typically start with 67, 68, 65, or 66.'
        };
      }
    } 
    // Check Orange provider
    else if (providerId === 'orange_money') {
      const prefix = cleanedNumber.substring(0, 2);
      if (!['69', '65', '66'].includes(prefix)) {
        return {
          isValid: false,
          message: 'This doesn\'t appear to be an Orange number. Orange numbers typically start with 69, 65, or 66.'
        };
      }
    }
  }
  
  // If we passed all checks, the number is valid
  return {
    isValid: true,
    message: null
  };
};

/**
 * Validates bank account numbers
 */
export const validateBankAccount = (accountNumber: string, countryCode: string): ValidationResult => {
  const cleanedNumber = accountNumber.replace(/\s/g, '');
  
  if (cleanedNumber.length < 8 || cleanedNumber.length > 24) {
    return {
      isValid: false,
      message: 'Invalid bank account format'
    };
  }
  
  return {
    isValid: true,
    message: null
  };
};

/**
 * Validates any account number based on type and country
 */
export const validateAccountNumber = (
  accountNumber: string,
  isBankAccount: boolean,
  countryCode = 'CM',
  providerId?: string
): ValidationResult => {
  if (accountNumber.trim() === '') {
    return {
      isValid: false,
      message: 'Account number is required'
    };
  }
  
  if (isBankAccount) {
    return validateBankAccount(accountNumber, countryCode);
  } else {
    // Mobile number validation based on country
    if (countryCode === 'CM') {
      return validateCameroonMobileNumber(accountNumber, providerId);
    } else {
      // Simple validation for other countries
      const cleanedNumber = accountNumber.replace(/\s/g, '').replace(/^\+/, '');
      if (cleanedNumber.length < 8 || cleanedNumber.length > 15) {
        return {
          isValid: false,
          message: 'Invalid mobile number format'
        };
      }
      return {
        isValid: true,
        message: null
      };
    }
  }
};
