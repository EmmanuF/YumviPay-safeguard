
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import ProviderOptions from './ProviderOptions';
import RecipientInfo from './RecipientInfo';
import { useLocale } from '@/contexts/LocaleContext';
import { getProviderById } from '@/data/cameroonPaymentProviders';

interface ExpandedContentProps {
  methodName: string;
  options: Array<{
    id: string;
    name: string;
  }>;
  selectedOption: string;
  recipientName: string;
  accountNumber: string;
  countryCode: string;
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
  countryCode,
  onOptionSelect,
  onRecipientNameChange,
  onAccountNumberChange,
}) => {
  const { t } = useLocale();
  const methodId = methodName.toLowerCase().includes('mobile') ? 'mobile_money' : 'bank_transfer';
  
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

  // Get provider details if available
  const providerDetails = selectedOption ? getProviderById(methodId, selectedOption) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100"
    >
      {options.length > 0 && (
        <div className="mb-4">
          <Label htmlFor="provider" className="text-sm font-medium mb-2 block">
            {methodId === 'mobile_money' ? t('momo.provider') : t('bank.provider')}
          </Label>
          <ProviderOptions
            options={options}
            selectedOption={selectedOption}
            onSelect={onOptionSelect}
            methodId={methodId}
          />
        </div>
      )}
      
      <RecipientInfo
        methodName={methodName}
        recipientName={recipientName}
        accountNumber={accountNumber}
        onRecipientNameChange={onRecipientNameChange}
        onAccountNumberChange={onAccountNumberChange}
        countryCode={countryCode}
      />

      {/* Provider-specific instructions */}
      {providerDetails?.instructions && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Instructions:</h4>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
            {providerDetails.instructions.map((instruction, idx) => (
              <li key={idx}>{instruction}</li>
            ))}
          </ul>
          {providerDetails.supportPhone && (
            <p className="mt-2 text-xs text-blue-600">
              Support: {providerDetails.supportPhone}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ExpandedContent;
