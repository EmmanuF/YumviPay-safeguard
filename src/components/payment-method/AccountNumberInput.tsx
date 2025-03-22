
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';
import { formatPhoneNumber } from '@/utils/formatters/phoneFormatters';
import { formatBankAccount } from '@/utils/formatters/bankFormatters';
import { getProviderById } from '@/data/cameroonPaymentProviders';

interface AccountNumberInputProps {
  accountNumber: string;
  onAccountNumberChange: (value: string) => void;
  isBankAccount: boolean;
  countryCode?: string;
  methodName: string;
  providerId?: string;
  onValidation?: (isValid: boolean) => void;
}

const AccountNumberInput: React.FC<AccountNumberInputProps> = ({
  accountNumber,
  onAccountNumberChange,
  isBankAccount,
  countryCode = 'CM',
  methodName,
  providerId,
  onValidation
}) => {
  const { t } = useLocale();
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const placeholder = isBankAccount 
    ? (t('bank.account_placeholder') || "Enter account number") 
    : (t('momo.number_placeholder') || "Enter mobile number (e.g. +237 6XX XX XX XX)");
  
  // Get provider details if available
  const methodId = isBankAccount ? 'bank_transfer' : 'mobile_money';
  const providerDetails = providerId ? getProviderById(providerId) : undefined;
  
  // Validate on change
  useEffect(() => {
    let valid = true;
    let message = null;
    
    if (accountNumber.trim() === '') {
      valid = false;
      message = 'Account number is required';
    } else if (isBankAccount) {
      // Bank account validation
      const cleanedNumber = accountNumber.replace(/\s/g, '');
      if (cleanedNumber.length < 8 || cleanedNumber.length > 24) {
        valid = false;
        message = 'Invalid bank account format';
      }
    } else {
      // Mobile number validation for Cameroon
      if (countryCode === 'CM') {
        const cleanedNumber = accountNumber.replace(/\s/g, '').replace(/^\+237/, '').replace(/^237/, '');
        
        // Check if it's a valid Cameroon mobile number
        // Must start with 6, followed by 8 more digits
        if (!/^6[0-9]{8}$/.test(cleanedNumber)) {
          valid = false;
          
          // Provide more specific error messages
          if (cleanedNumber.length !== 9) {
            message = 'Cameroon mobile numbers must have 9 digits after the country code';
          } else if (!/^6/.test(cleanedNumber)) {
            message = 'Cameroon mobile numbers must start with 6 after the country code';
          } else {
            message = 'Invalid Cameroon mobile number format';
          }
        } else {
          // Check if the number is valid for the selected provider
          if (providerId === 'mtn_momo') {
            // MTN numbers typically start with 67, 68, 65, 66
            const prefix = cleanedNumber.substring(0, 2);
            if (!['67', '68', '65', '66'].includes(prefix)) {
              valid = false;
              message = 'This doesn\'t appear to be an MTN number. MTN numbers typically start with 67, 68, 65, or 66.';
            }
          } else if (providerId === 'orange_money') {
            // Orange numbers typically start with 69, 65, 66
            const prefix = cleanedNumber.substring(0, 2);
            if (!['69', '65', '66'].includes(prefix)) {
              valid = false;
              message = 'This doesn\'t appear to be an Orange number. Orange numbers typically start with 69, 65, or 66.';
            }
          }
        }
      } else {
        // Simple validation for other countries
        const cleanedNumber = accountNumber.replace(/\s/g, '').replace(/^\+/, '');
        if (cleanedNumber.length < 8 || cleanedNumber.length > 15) {
          valid = false;
          message = 'Invalid mobile number format';
        }
      }
    }
    
    setIsValid(valid);
    setErrorMessage(message);
    if (onValidation) onValidation(valid);
  }, [accountNumber, isBankAccount, countryCode, onValidation, providerId]);
  
  // Format the input value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Strip non-numeric characters except for + at the beginning
    const digitsOnly = value.replace(/[^\d+]/g, '').replace(/^\+?/, '+');
    
    // Format based on type and country
    if (isBankAccount) {
      value = formatBankAccount(digitsOnly, countryCode);
    } else {
      value = formatPhoneNumber(digitsOnly, countryCode);
    }
    
    onAccountNumberChange(value);
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor="accountNumber" className="text-sm font-medium">
          {isBankAccount ? (t('bank.account_number') || "Account Number") : (t('momo.mobile_number') || "Mobile Number")}
        </Label>
        
        {providerDetails && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center text-xs text-blue-600">
                <HelpCircle className="h-3.5 w-3.5 mr-1" />
                <span>Format help</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <h4 className="font-medium mb-2">{providerDetails.name} Format</h4>
              <p className="text-sm text-gray-600 mb-3">
                {isBankAccount
                  ? "Bank account numbers are typically 10-20 digits, sometimes with spaces or dashes."
                  : providerId === 'mtn_momo' 
                    ? "MTN mobile numbers in Cameroon start with +237 followed by a 9-digit number starting with 6. Common MTN prefixes are 67, 68, 65, or 66."
                    : "Orange mobile numbers in Cameroon start with +237 followed by a 9-digit number starting with 6. Common Orange prefixes are 69, 65, or 66."}
              </p>
              {providerDetails.instructions && (
                <div>
                  <h5 className="text-sm font-medium mb-1">Tips:</h5>
                  <ul className="list-disc pl-5 text-xs text-gray-700">
                    {providerDetails.instructions.slice(0, 2).map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      <div className="relative">
        <Input
          id="accountNumber"
          placeholder={placeholder}
          value={accountNumber}
          onChange={handleChange}
          className={cn(
            "w-full pr-10",
            isValid && accountNumber ? "border-green-500 focus:ring-green-500" : "",
            errorMessage ? "border-red-500 focus:ring-red-500" : ""
          )}
        />
        {accountNumber && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            )}
          </div>
        )}
      </div>
      
      {errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
      
      {isValid && accountNumber && (
        <p className="text-xs text-green-600 mt-1">
          {isBankAccount ? "Valid account format" : "Valid mobile number format"}
        </p>
      )}
    </div>
  );
};

export default AccountNumberInput;
