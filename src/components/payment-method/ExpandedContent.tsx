
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ExpandedContentProps {
  methodName: string;
  options: Array<{
    id: string;
    name: string;
    logoUrl?: string;
  }>;
  selectedOption: string;
  onOptionSelect: (optionId: string) => void;
  recipientName: string;
  accountNumber: string;
  onRecipientNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  countryCode: string;
}

const ExpandedContent: React.FC<ExpandedContentProps> = ({
  methodName,
  options,
  selectedOption,
  onOptionSelect,
  recipientName,
  accountNumber,
  onRecipientNameChange,
  onAccountNumberChange,
  countryCode
}) => {
  const isBankMethod = methodName.toLowerCase().includes('bank');
  const phonePrefix = countryCode === 'CM' ? '+237' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100"
    >
      <div className="mb-4">
        <Label htmlFor="provider" className="text-sm font-medium mb-2 block">Select Provider</Label>
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => onOptionSelect(option.id)}
              className={`p-3 rounded-md border text-center cursor-pointer transition-all flex items-center justify-center gap-2 ${
                selectedOption === option.id
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {option.logoUrl && (
                <img 
                  src={option.logoUrl} 
                  alt={option.name} 
                  className="h-4 w-4 object-contain" 
                />
              )}
              {option.name}
            </div>
          ))}
        </div>
      </div>
      
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
            Important: The recipient name must exactly match the name registered on their {isBankMethod ? 'bank account' : 'mobile money account'}. Mismatched names may cause transaction delays or funds being sent to the wrong person.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="accountNumber" className="text-sm font-medium mb-2 block">
          {isBankMethod ? 'Account Number' : 'Mobile Number'}
        </Label>
        <div className="relative">
          {!isBankMethod && phonePrefix && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">{phonePrefix}</span>
            </div>
          )}
          <Input
            id="accountNumber"
            placeholder={isBankMethod ? "Enter account number" : `Enter mobile number ${phonePrefix ? 'without prefix' : ''}`}
            value={accountNumber}
            onChange={(e) => onAccountNumberChange(e.target.value)}
            className={!isBankMethod && phonePrefix ? "pl-12 w-full" : "w-full"}
          />
        </div>
        {!isBankMethod && (
          <p className="text-xs text-gray-500 mt-1">
            Example: {countryCode === 'CM' ? '6XXXXXXXX (9 digits without the +237 prefix)' : 'Enter complete number'}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ExpandedContent;
