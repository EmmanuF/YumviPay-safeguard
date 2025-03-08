
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
          placeholder={isBankAccount ? "Enter account number" : "Enter mobile number"}
          value={accountNumber}
          onChange={(e) => onAccountNumberChange(e.target.value)}
          className="w-full"
        />
      </div>
    </>
  );
};

export default RecipientInfo;
