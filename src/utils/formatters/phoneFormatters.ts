
// Phone number format patterns by country
export const COUNTRY_PHONE_CODES: Record<string, string> = {
  CM: '+237', // Cameroon
  NG: '+234', // Nigeria
  GH: '+233', // Ghana
  KE: '+254', // Kenya
  ZA: '+27',  // South Africa
  SN: '+221', // Senegal
  CI: '+225', // Côte d'Ivoire
  MA: '+212', // Morocco
  EG: '+20',  // Egypt
  // Add more countries as needed
};

// Phone number format patterns by country
export const PHONE_NUMBER_FORMATS: Record<string, { 
  pattern: string, 
  example: string,
  requiredLength: number, 
  regex: RegExp 
}> = {
  CM: { 
    pattern: '+XXX XXX XX XX XX', 
    example: '+237 6XX XX XX XX',
    requiredLength: 9, // National number length
    regex: /^(6|2)[0-9]{8}$/ // Should start with 6 or 2, then 8 more digits
  },
  NG: { 
    pattern: '+XXX XXX XXX XXXX', 
    example: '+234 8XX XXX XXXX',
    requiredLength: 10,
    regex: /^[0-9]{10}$/ // 10 digits
  },
  GH: { 
    pattern: '+XXX XX XXX XXXX', 
    example: '+233 5X XXX XXXX',
    requiredLength: 9,
    regex: /^[0-9]{9}$/ // 9 digits
  },
  KE: { 
    pattern: '+XXX XXX XXX XXX', 
    example: '+254 7XX XXX XXX',
    requiredLength: 9,
    regex: /^[0-9]{9}$/ // 9 digits
  },
  ZA: { 
    pattern: '+XX XX XXX XXXX', 
    example: '+27 6X XXX XXXX',
    requiredLength: 9,
    regex: /^[0-9]{9}$/ // 9 digits
  },
  // Default pattern for countries not specifically defined
  default: {
    pattern: '+XXX XXX XXX XXX',
    example: '+XXX XXX XXX XXX',
    requiredLength: 9,
    regex: /^[0-9]{9,}$/ // At least 9 digits
  }
};

/**
 * Format mobile phone number based on country code
 * For Cameroon: +237 6XX XX XX XX
 */
export const formatPhoneNumber = (digitsOnly: string, countryCode: string): string => {
  // Start with the country code
  const countryPhoneCode = COUNTRY_PHONE_CODES[countryCode] || '+237';
  
  // Clean up the input by removing any non-digit characters except the leading +
  let cleanInput = digitsOnly.replace(/[^\d+]/g, '');
  
  // Extract the national number part
  let nationalNumber = '';
  
  // If the input already has the country code, extract just the national part
  if (cleanInput.startsWith('+')) {
    const countryCodeDigits = countryPhoneCode.substring(1); // Remove the + sign
    if (cleanInput.startsWith('+' + countryCodeDigits)) {
      nationalNumber = cleanInput.substring(countryPhoneCode.length);
    } else {
      // Has a + but wrong country code - replace with the correct one
      nationalNumber = cleanInput.substring(cleanInput.indexOf('+') + 1);
      // If the user entered a country code, remove it
      const enteredCountryCode = nationalNumber.substring(0, 3); // Assume country codes are at most 3 digits
      if (/^\d{1,3}$/.test(enteredCountryCode)) {
        nationalNumber = nationalNumber.substring(enteredCountryCode.length);
      }
    }
  } else if (cleanInput.startsWith(countryPhoneCode.substring(1))) {
    // Starts with country code digits without +
    nationalNumber = cleanInput.substring(countryPhoneCode.length - 1);
  } else {
    // Doesn't start with country code, assume it's just the national number
    nationalNumber = cleanInput;
  }
  
  // Start building the formatted result with the country code
  let formattedResult = countryPhoneCode;
  
  // Format based on country pattern
  switch (countryCode) {
    case 'CM': // Cameroon: +237 6XX XX XX XX
      if (nationalNumber.length > 0) formattedResult += ' ' + nationalNumber.substring(0, 3);
      if (nationalNumber.length > 3) formattedResult += ' ' + nationalNumber.substring(3, 5);
      if (nationalNumber.length > 5) formattedResult += ' ' + nationalNumber.substring(5, 7);
      if (nationalNumber.length > 7) formattedResult += ' ' + nationalNumber.substring(7, 9);
      break;
      
    case 'NG': // Nigeria: +234 8XX XXX XXXX
      if (nationalNumber.length > 0) formattedResult += ' ' + nationalNumber.substring(0, 3);
      if (nationalNumber.length > 3) formattedResult += ' ' + nationalNumber.substring(3, 6);
      if (nationalNumber.length > 6) formattedResult += ' ' + nationalNumber.substring(6, 10);
      break;
      
    case 'GH': // Ghana: +233 5X XXX XXXX
      if (nationalNumber.length > 0) formattedResult += ' ' + nationalNumber.substring(0, 2);
      if (nationalNumber.length > 2) formattedResult += ' ' + nationalNumber.substring(2, 5);
      if (nationalNumber.length > 5) formattedResult += ' ' + nationalNumber.substring(5, 9);
      break;
      
    case 'KE': // Kenya: +254 7XX XXX XXX
      if (nationalNumber.length > 0) formattedResult += ' ' + nationalNumber.substring(0, 3);
      if (nationalNumber.length > 3) formattedResult += ' ' + nationalNumber.substring(3, 6);
      if (nationalNumber.length > 6) formattedResult += ' ' + nationalNumber.substring(6, 9);
      break;
      
    case 'ZA': // South Africa: +27 6X XXX XXXX
      if (nationalNumber.length > 0) formattedResult += ' ' + nationalNumber.substring(0, 2);
      if (nationalNumber.length > 2) formattedResult += ' ' + nationalNumber.substring(2, 5);
      if (nationalNumber.length > 5) formattedResult += ' ' + nationalNumber.substring(5, 9);
      break;
      
    default: // Default format for other countries
      if (nationalNumber.length > 0) formattedResult += ' ' + nationalNumber.substring(0, 3);
      if (nationalNumber.length > 3) formattedResult += ' ' + nationalNumber.substring(3, 6);
      if (nationalNumber.length > 6) formattedResult += ' ' + nationalNumber.substring(6, 9);
  }
  
  return formattedResult.trim();
};

/**
 * Validate if a phone number meets the required format for a country
 */
export const isValidPhoneNumber = (phoneNumber: string, countryCode: string): boolean => {
  // Get the format requirements for this country
  const countryFormat = PHONE_NUMBER_FORMATS[countryCode] || PHONE_NUMBER_FORMATS.default;
  
  // Extract only the national number (remove country code and spaces)
  const countryPhoneCode = COUNTRY_PHONE_CODES[countryCode] || '+237';
  
  // First check if it starts with the right country code
  if (!phoneNumber.startsWith(countryPhoneCode)) {
    return false;
  }
  
  // Remove the country code and any spaces/formatting
  const nationalNumber = phoneNumber
    .substring(countryPhoneCode.length)
    .replace(/\s/g, '');
  
  // Check the length
  if (nationalNumber.length !== countryFormat.requiredLength) {
    return false;
  }
  
  // Check the pattern
  return countryFormat.regex.test(nationalNumber);
};

/**
 * Format mobile number - alias for formatPhoneNumber
 */
export const formatMobileNumber = formatPhoneNumber;

/**
 * Format bank account number based on country code using the bankFormatters
 */
export const formatBankAccount = (accountNumber: string, countryCode: string): string => {
  // Import and use the bankFormatters function
  const { formatBankAccount: formatBankAccountFromBankFormatters } = require('../formatters/bankFormatters');
  return formatBankAccountFromBankFormatters(accountNumber, countryCode);
};
