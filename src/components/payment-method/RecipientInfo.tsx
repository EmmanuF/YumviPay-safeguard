import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/contexts/LocaleContext';

interface RecipientInfoProps {
  methodName: string;
  recipientName: string;
  accountNumber: string;
  onRecipientNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  countryCode?: string; // Added country code prop
}

// Country phone code mappings
const COUNTRY_PHONE_CODES: Record<string, string> = {
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
const PHONE_NUMBER_FORMATS: Record<string, { pattern: string, example: string }> = {
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

// Bank account number patterns by country
const BANK_FORMATS: Record<string, { pattern: string, example: string }> = {
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

const RecipientInfo: React.FC<RecipientInfoProps> = ({
  methodName,
  recipientName,
  accountNumber,
  onRecipientNameChange,
  onAccountNumberChange,
  countryCode = 'CM', // Default to Cameroon if not specified
}) => {
  const { t } = useLocale();
  const isBankAccount = methodName.toLowerCase().includes('bank');
  
  // Format phone/account number as user types
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    if (isBankAccount) {
      // Format bank account number according to country-specific rules
      const format = BANK_FORMATS[countryCode] || BANK_FORMATS.CM;
      let formattedValue = '';
      let chunkSize = 4; // Default chunk size
      
      // Different countries may have different formatting rules
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
        for (let i = 0; i < digitsOnly.length; i++) {
          if (i > 0 && i % chunkSize === 0) {
            formattedValue += ' ';
          }
          formattedValue += digitsOnly[i];
        }
      }
      
      onAccountNumberChange(formattedValue);
    } else {
      // For mobile money, format as country-specific phone number
      if (digitsOnly.length > 0) {
        // Get country code from mapping or default
        const countryPhoneCode = COUNTRY_PHONE_CODES[countryCode] || '+237';
        
        // Start with the country code
        value = countryPhoneCode;
        
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
      }
      
      onAccountNumberChange(value);
    }
  };

  // Generate placeholder text based on method type and country
  const getPlaceholder = () => {
    if (isBankAccount) {
      const format = BANK_FORMATS[countryCode] || BANK_FORMATS.CM;
      return t('bank.enter_account') || `Enter account number (e.g., ${format.example})`;
    } else {
      const format = PHONE_NUMBER_FORMATS[countryCode] || PHONE_NUMBER_FORMATS.CM;
      return t('momo.enter_number') || `Enter mobile number (e.g., ${format.example})`;
    }
  };

  // Get format example
  const getFormatExample = () => {
    if (isBankAccount) {
      const format = BANK_FORMATS[countryCode] || BANK_FORMATS.CM;
      return t('bank.account_format') || format.pattern;
    } else {
      const format = PHONE_NUMBER_FORMATS[countryCode] || PHONE_NUMBER_FORMATS.CM;
      return t('momo.number_format') || format.pattern;
    }
  };
  
  return (
    <>
      <div className="mb-4">
        <Label htmlFor="recipientName" className="text-sm font-medium mb-2 block">
          {t('transaction.recipient') || "Recipient Name"}
        </Label>
        <Input
          id="recipientName"
          placeholder={t('transaction.recipient') || "Enter recipient's full name"}
          value={recipientName}
          onChange={(e) => onRecipientNameChange(e.target.value)}
          className="w-full"
        />
        <div className="mt-2 flex items-start gap-2 p-2 bg-amber-50 rounded-md">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            {isBankAccount 
              ? (t('bank.name_warning') || "Important: The recipient name must exactly match the name registered on their bank account. Mismatched names may cause transaction delays or funds being sent to the wrong person.")
              : (t('momo.name_warning') || "Important: The recipient name must exactly match the name registered on their mobile money account. Mismatched names may cause transaction delays or funds being sent to the wrong person.")}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="accountNumber" className="text-sm font-medium mb-2 block">
          {isBankAccount ? t('bank.account_number') || 'Account Number' : t('momo.number') || 'Mobile Number'}
        </Label>
        <Input
          id="accountNumber"
          placeholder={getPlaceholder()}
          value={accountNumber}
          onChange={handleAccountNumberChange}
          className="w-full"
          inputMode={isBankAccount ? "numeric" : "tel"}
        />
        <p className="text-xs text-gray-500 mt-1">
          {getFormatExample()}
        </p>
      </div>
    </>
  );
};

export default RecipientInfo;
