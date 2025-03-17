
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/contexts/LocaleContext';

interface RecipientNameInputProps {
  recipientName: string;
  onRecipientNameChange: (value: string) => void;
  isBankAccount: boolean;
}

const RecipientNameInput: React.FC<RecipientNameInputProps> = ({
  recipientName,
  onRecipientNameChange,
  isBankAccount
}) => {
  const { t } = useLocale();
  
  return (
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
  );
};

export default RecipientNameInput;
