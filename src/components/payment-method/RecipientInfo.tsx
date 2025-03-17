
import React from 'react';
import RecipientNameInput from './RecipientNameInput';
import AccountNumberInput from './AccountNumberInput';

interface RecipientInfoProps {
  methodName: string;
  recipientName: string;
  accountNumber: string;
  onRecipientNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  countryCode?: string;
}

const RecipientInfo: React.FC<RecipientInfoProps> = ({
  methodName,
  recipientName,
  accountNumber,
  onRecipientNameChange,
  onAccountNumberChange,
  countryCode = 'CM', // Default to Cameroon if not specified
}) => {
  const isBankAccount = methodName.toLowerCase().includes('bank');
  
  return (
    <>
      <RecipientNameInput 
        recipientName={recipientName}
        onRecipientNameChange={onRecipientNameChange}
        isBankAccount={isBankAccount}
      />

      <AccountNumberInput
        accountNumber={accountNumber}
        onAccountNumberChange={onAccountNumberChange}
        isBankAccount={isBankAccount}
        countryCode={countryCode}
        methodName={methodName}
      />
    </>
  );
};

export default RecipientInfo;
