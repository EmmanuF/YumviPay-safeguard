
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';
import { formatPhoneNumber } from '@/utils/formatters/phoneFormatters';
import { formatBankAccount } from '@/utils/formatters/bankFormatters';
import { validateAccountNumber } from '@/utils/validators/accountNumberValidator';
import FormatHelpPopover from './FormatHelpPopover';
import ValidationStatusIndicator from './ValidationStatusIndicator';

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
  
  // Validate on change
  useEffect(() => {
    const validationResult = validateAccountNumber(
      accountNumber,
      isBankAccount,
      countryCode,
      providerId
    );
    
    setIsValid(validationResult.isValid);
    setErrorMessage(validationResult.message);
    
    if (onValidation) {
      onValidation(validationResult.isValid);
    }
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
        
        {providerId && (
          <FormatHelpPopover 
            providerId={providerId} 
            isBankAccount={isBankAccount} 
          />
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
        
        <ValidationStatusIndicator 
          isValid={isValid}
          hasInput={!!accountNumber}
          message={errorMessage}
          isBankAccount={isBankAccount}
        />
      </div>
    </div>
  );
};

export default AccountNumberInput;
