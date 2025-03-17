
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/contexts/LocaleContext';
import { BANK_FORMATS } from '@/utils/formatters/bankFormatters';
import { PHONE_NUMBER_FORMATS } from '@/utils/formatters/phoneFormatters';
import { formatPhoneNumber } from '@/utils/formatters/phoneFormatters';
import { formatBankAccount } from '@/utils/formatters/bankFormatters';

interface AccountNumberInputProps {
  accountNumber: string;
  onAccountNumberChange: (value: string) => void;
  isBankAccount: boolean;
  countryCode: string;
  methodName: string;
}

const AccountNumberInput: React.FC<AccountNumberInputProps> = ({
  accountNumber,
  onAccountNumberChange,
  isBankAccount,
  countryCode,
  methodName
}) => {
  const { t } = useLocale();
  
  // Format phone/account number as user types
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    if (isBankAccount) {
      value = formatBankAccount(digitsOnly, countryCode);
    } else {
      // For mobile money, format as country-specific phone number
      if (digitsOnly.length > 0) {
        value = formatPhoneNumber(digitsOnly, countryCode);
      }
    }
    
    onAccountNumberChange(value);
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
  );
};

export default AccountNumberInput;
