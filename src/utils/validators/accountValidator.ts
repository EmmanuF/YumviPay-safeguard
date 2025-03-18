
interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Validates bank account or mobile number formats based on country and provider
 */
export const validateAccountNumber = (
  accountNumber: string,
  isBankAccount: boolean,
  countryCode: string,
  providerId?: string
): ValidationResult => {
  let valid = true;
  let message = null;
  
  if (accountNumber.trim() === '') {
    return {
      isValid: false,
      message: 'Account number is required'
    };
  }
  
  if (isBankAccount) {
    // Bank account validation
    const cleanedNumber = accountNumber.replace(/\s/g, '');
    if (cleanedNumber.length < 8 || cleanedNumber.length > 24) {
      return {
        isValid: false,
        message: 'Invalid bank account format'
      };
    }
  } else {
    // Mobile number validation for Cameroon
    if (countryCode === 'CM') {
      const cleanedNumber = accountNumber.replace(/\s/g, '').replace(/^\+237/, '').replace(/^237/, '');
      
      // Check if it's a valid Cameroon mobile number
      // Must start with 6, followed by 8 more digits
      if (!/^6[0-9]{8}$/.test(cleanedNumber)) {
        // Provide more specific error messages
        if (cleanedNumber.length !== 9) {
          return {
            isValid: false,
            message: 'Cameroon mobile numbers must have 9 digits after the country code'
          };
        } else if (!/^6/.test(cleanedNumber)) {
          return {
            isValid: false,
            message: 'Cameroon mobile numbers must start with 6 after the country code'
          };
        } else {
          return {
            isValid: false,
            message: 'Invalid Cameroon mobile number format'
          };
        }
      }
      
      // Check if the number is valid for the selected provider
      if (providerId === 'mtn_momo') {
        // MTN numbers typically start with 67, 68, 65, 66
        const prefix = cleanedNumber.substring(0, 2);
        if (!['67', '68', '65', '66'].includes(prefix)) {
          return {
            isValid: false,
            message: 'This doesn\'t appear to be an MTN number. MTN numbers typically start with 67, 68, 65, or 66.'
          };
        }
      } else if (providerId === 'orange_money') {
        // Orange numbers typically start with 69, 65, 66
        const prefix = cleanedNumber.substring(0, 2);
        if (!['69', '65', '66'].includes(prefix)) {
          return {
            isValid: false,
            message: 'This doesn\'t appear to be an Orange number. Orange numbers typically start with 69, 65, or 66.'
          };
        }
      }
    } else {
      // Simple validation for other countries
      const cleanedNumber = accountNumber.replace(/\s/g, '').replace(/^\+/, '');
      if (cleanedNumber.length < 8 || cleanedNumber.length > 15) {
        return {
          isValid: false,
          message: 'Invalid mobile number format'
        };
      }
    }
  }
  
  return { isValid: valid, message };
};
