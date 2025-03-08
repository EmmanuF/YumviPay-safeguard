
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import ProviderOptions from './ProviderOptions';
import RecipientInfo from './RecipientInfo';

interface ExpandedContentProps {
  methodName: string;
  options: Array<{
    id: string;
    name: string;
  }>;
  selectedOption: string;
  recipientName: string;
  accountNumber: string;
  onOptionSelect: (optionId: string) => void;
  onRecipientNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
}

const ExpandedContent: React.FC<ExpandedContentProps> = ({
  methodName,
  options,
  selectedOption,
  recipientName,
  accountNumber,
  onOptionSelect,
  onRecipientNameChange,
  onAccountNumberChange,
}) => {
  // Auto-select the first option if none is selected
  useEffect(() => {
    if (options.length > 0 && !selectedOption) {
      onOptionSelect(options[0].id);
    }
  }, [options, selectedOption, onOptionSelect]);

  // Clear account number when changing providers to avoid format confusion
  useEffect(() => {
    if (selectedOption) {
      onAccountNumberChange('');
    }
  }, [selectedOption, onAccountNumberChange]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100"
    >
      {options.length > 0 && (
        <div className="mb-4">
          <Label htmlFor="provider" className="text-sm font-medium mb-2 block">Select Provider</Label>
          <ProviderOptions
            options={options}
            selectedOption={selectedOption}
            onSelect={onOptionSelect}
          />
        </div>
      )}
      
      <RecipientInfo
        methodName={methodName}
        recipientName={recipientName}
        accountNumber={accountNumber}
        onRecipientNameChange={onRecipientNameChange}
        onAccountNumberChange={onAccountNumberChange}
      />
    </motion.div>
  );
};

export default ExpandedContent;
