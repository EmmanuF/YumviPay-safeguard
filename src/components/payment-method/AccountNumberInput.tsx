
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';
import { formatPhoneNumber, formatMobileNumber } from '@/utils/formatters/phoneFormatters';
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
    : (t('momo.number_placeholder') || "Enter mobile number");
  
  // Get provider details if available
  const methodId = isBankAccount ? 'bank_transfer' : 'mobile_money';
  const providerDetails = providerId ? getProviderById(methodId, providerId) : undefined;
  
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
        if (!/^[6-9][0-9]{8}$/.test(cleanedNumber)) {
          valid = false;
          message = 'Cameroon mobile numbers should start with 6, 7, 8, or 9 and have 9 digits';
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
  }, [accountNumber, isBankAccount, countryCode, onValidation]);
  
  // Format the input value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Format the number based on type and country
    if (isBankAccount) {
      value = formatBankAccount(value, countryCode);
    } else {
      value = formatPhoneNumber(value, countryCode);
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
                  : "Mobile numbers in Cameroon start with +237 followed by a 9-digit number starting with 6, 7, 8, or 9."}
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
          {isBankAccount ? "Valid account format" : "Valid mobile format"}
        </p>
      )}
    </div>
  );
};

export default AccountNumberInput;
