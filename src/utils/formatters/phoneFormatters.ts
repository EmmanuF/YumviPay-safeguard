
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
export const PHONE_NUMBER_FORMATS: Record<string, { pattern: string, example: string }> = {
  CM: { 
    pattern: '+XXX XXX XX XX XX', 
    example: '+237 6XX XX XX XX' 
  },
  NG: { 
    pattern: '+XXX XXX XXX XXXX', 
    example: '+234 8XX XXX XXXX' 
  },
  GH: { 
    pattern: '+XXX XX XXX XXXX', 
    example: '+233 5X XXX XXXX' 
  },
  KE: { 
    pattern: '+XXX XXX XXX XXX', 
    example: '+254 7XX XXX XXX' 
  },
  ZA: { 
    pattern: '+XX XX XXX XXXX', 
    example: '+27 6X XXX XXXX' 
  },
  // Add more formatting patterns as needed
};

/**
 * Format mobile phone number based on country code
 */
export const formatPhoneNumber = (digitsOnly: string, countryCode: string): string => {
  // Start with the country code
  const countryPhoneCode = COUNTRY_PHONE_CODES[countryCode] || '+237';
  let value = countryPhoneCode;
  
  // Remove the country code from the digits if user entered it
  let nationalNumber = digitsOnly;
  const countryCodeDigits = countryPhoneCode.substring(1); // Remove the + sign
  if (digitsOnly.startsWith(countryCodeDigits)) {
    nationalNumber = digitsOnly.substring(countryCodeDigits.length);
  }
  
  // Format based on country
  switch (countryCode) {
    case 'CM': // Cameroon: +237 6XX XX XX XX
      if (nationalNumber.length > 0) value += ' ' + nationalNumber.substring(0, 3);
      if (nationalNumber.length > 3) value += ' ' + nationalNumber.substring(3, 5);
      if (nationalNumber.length > 5) value += ' ' + nationalNumber.substring(5, 7);
      if (nationalNumber.length > 7) value += ' ' + nationalNumber.substring(7);
      break;
      
    case 'NG': // Nigeria: +234 8XX XXX XXXX
      if (nationalNumber.length > 0) value += ' ' + nationalNumber.substring(0, 3);
      if (nationalNumber.length > 3) value += ' ' + nationalNumber.substring(3, 6);
      if (nationalNumber.length > 6) value += ' ' + nationalNumber.substring(6);
      break;
      
    case 'GH': // Ghana: +233 5X XXX XXXX
      if (nationalNumber.length > 0) value += ' ' + nationalNumber.substring(0, 2);
      if (nationalNumber.length > 2) value += ' ' + nationalNumber.substring(2, 5);
      if (nationalNumber.length > 5) value += ' ' + nationalNumber.substring(5);
      break;
      
    case 'KE': // Kenya: +254 7XX XXX XXX
      if (nationalNumber.length > 0) value += ' ' + nationalNumber.substring(0, 3);
      if (nationalNumber.length > 3) value += ' ' + nationalNumber.substring(3, 6);
      if (nationalNumber.length > 6) value += ' ' + nationalNumber.substring(6);
      break;
      
    case 'ZA': // South Africa: +27 6X XXX XXXX
      if (nationalNumber.length > 0) value += ' ' + nationalNumber.substring(0, 2);
      if (nationalNumber.length > 2) value += ' ' + nationalNumber.substring(2, 5);
      if (nationalNumber.length > 5) value += ' ' + nationalNumber.substring(5);
      break;
      
    default: // Default format
      if (nationalNumber.length > 0) value += ' ' + nationalNumber.substring(0, 3);
      if (nationalNumber.length > 3) value += ' ' + nationalNumber.substring(3, 6);
      if (nationalNumber.length > 6) value += ' ' + nationalNumber.substring(6, 9);
      if (nationalNumber.length > 9) value += ' ' + nationalNumber.substring(9);
  }
  
  return value;
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
