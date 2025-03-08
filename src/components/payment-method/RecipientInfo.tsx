
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RecipientInfoProps {
  methodName: string;
  recipientName: string;
  accountNumber: string;
  onRecipientNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
}

const RecipientInfo: React.FC<RecipientInfoProps> = ({
  methodName,
  recipientName,
  accountNumber,
  onRecipientNameChange,
  onAccountNumberChange,
}) => {
  const isBankAccount = methodName.toLowerCase().includes('bank');
  
  // Format phone/account number as user types
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    if (isBankAccount) {
      // For bank accounts, format with spaces every 4 digits
      let formattedValue = '';
      for (let i = 0; i < digitsOnly.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += ' ';
        }
        formattedValue += digitsOnly[i];
      }
      onAccountNumberChange(formattedValue);
    } else {
      // For mobile money, format as phone number (e.g., +237 6XX XX XX XX for Cameroon)
      if (digitsOnly.length > 0) {
        // Add country code prefix if not present
        if (!value.startsWith('+')) {
          value = '+' + digitsOnly;
        } else {
          value = '+' + digitsOnly;
        }
        
        // Add spaces for readability based on typical mobile number formats
        if (digitsOnly.length > 3) {
          value = value.substring(0, 4) + ' ' + value.substring(4);
        }
        if (digitsOnly.length > 6) {
          value = value.substring(0, 7) + ' ' + value.substring(7);
        }
        if (digitsOnly.length > 9) {
          value = value.substring(0, 10) + ' ' + value.substring(10);
        }
      }
      onAccountNumberChange(value);
    }
  };

  // Generate placeholder text based on method type
  const getPlaceholder = () => {
    if (isBankAccount) {
      return "Enter account number (e.g., 1234 5678 9012 3456)";
    } else {
      return "Enter mobile number (e.g., +237 6XX XX XX XX)";
    }
  };
  
  return (
    <>
      <div className="mb-4">
        <Label htmlFor="recipientName" className="text-sm font-medium mb-2 block">
          Recipient Name
        </Label>
        <Input
          id="recipientName"
          placeholder="Enter recipient's full name"
          value={recipientName}
          onChange={(e) => onRecipientNameChange(e.target.value)}
          className="w-full"
        />
        <div className="mt-2 flex items-start gap-2 p-2 bg-amber-50 rounded-md">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            Important: The recipient name must exactly match the name registered on their {isBankAccount ? 'bank account' : 'mobile money account'}. Mismatched names may cause transaction delays or funds being sent to the wrong person.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="accountNumber" className="text-sm font-medium mb-2 block">
          {isBankAccount ? 'Account Number' : 'Mobile Number'}
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
          {isBankAccount 
            ? "Enter the account number without any special characters" 
            : "Enter the full mobile number including country code"}
        </p>
      </div>
    </>
  );
};

export default RecipientInfo;
