
// Bank account number patterns by country
export const BANK_FORMATS: Record<string, { pattern: string, example: string }> = {
  CM: { 
    pattern: 'XXXXX XXXXX XXXXX XXXXXX', 
    example: '12345 67890 12345 678901' 
  },
  NG: { 
    pattern: 'XXXXXXXXXX', 
    example: '0123456789' 
  },
  GH: { 
    pattern: 'XXXX XXXX XXXX XXXX', 
    example: '1234 5678 9012 3456' 
  },
  // Add more bank account formats as needed
};

/**
 * Format bank account number based on country code
 */
export const formatBankAccount = (digitsOnly: string, countryCode: string): string => {
  let formattedValue = '';
  
  // Format bank account number according to country-specific rules
  if (countryCode === 'CM') {
    // Format: XXXXX XXXXX XXXXX XXXXXX (5-5-5-6)
    const chunks = [5, 5, 5, 6];
    let digitIndex = 0;
    
    for (let i = 0; i < chunks.length && digitIndex < digitsOnly.length; i++) {
      if (i > 0 && formattedValue.length > 0) {
        formattedValue += ' ';
      }
      
      formattedValue += digitsOnly.substring(digitIndex, digitIndex + chunks[i]);
      digitIndex += chunks[i];
    }
  } else if (countryCode === 'NG') {
    // Nigerian bank accounts are typically 10 digits without spaces
    formattedValue = digitsOnly.substring(0, 10);
  } else {
    // Default formatting with spaces every 4 digits
    const chunkSize = 4;
    for (let i = 0; i < digitsOnly.length; i++) {
      if (i > 0 && i % chunkSize === 0) {
        formattedValue += ' ';
      }
      formattedValue += digitsOnly[i];
    }
  }
  
  return formattedValue;
};
