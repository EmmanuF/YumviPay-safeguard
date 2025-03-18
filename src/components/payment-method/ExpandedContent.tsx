
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import ProviderOptions from './ProviderOptions';
import RecipientInfo from './RecipientInfo';
import VerificationStatus from './VerificationStatus';
import ProviderDetails from './ProviderDetails';
import ProviderInstructions from './ProviderInstructions';
import { useLocale } from '@/contexts/LocaleContext';
import { getProviderById } from '@/data/cameroonPaymentProviders';
import { verifyRecipient } from '@/utils/recipientUtils';
import { toast } from '@/hooks/use-toast';

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
  const methodId = methodName.toLowerCase().includes('mobile') 
    ? 'mobile_money' 
    : methodName.toLowerCase().includes('bank') 
      ? 'bank_transfer' 
      : 'cash_pickup';
  const [isValid, setIsValid] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [hasVerified, setHasVerified] = useState(false);
  
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
      setHasVerified(false);
      setVerificationMessage('');
    }
  }, [selectedOption, onAccountNumberChange]);

  // Get provider details if available
  const providerDetails = selectedOption ? getProviderById(methodId, selectedOption) : undefined;

  // Verify recipient when both name and account are provided
  useEffect(() => {
    if (recipientName && accountNumber && selectedOption) {
      const result = verifyRecipient(
        { 
          id: 'temp', 
          name: recipientName, 
          contact: accountNumber, 
          country: countryCode, 
          isFavorite: false 
        }, 
        selectedOption
      );
      
      setIsValid(result.isValid);
      setVerificationMessage(result.message || '');
      
      if (result.isValid && !hasVerified) {
        toast({
          title: "Recipient information valid",
          description: "The recipient information format has been verified"
        });
        setHasVerified(true);
      }
    } else {
      setIsValid(false);
      setHasVerified(false);
    }
  }, [recipientName, accountNumber, selectedOption, countryCode, hasVerified]);

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
            {methodId === 'mobile_money' 
              ? t('momo.provider') || "Select Mobile Money Provider"
              : methodId === 'bank_transfer'
                ? t('bank.provider') || "Select Bank"
                : t('cash.provider') || "Select Cash Pickup Provider"}
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
        providerId={selectedOption}
        onValidation={(valid) => setIsValid(valid)}
      />

      {/* Verification Status Component */}
      <VerificationStatus 
        isValid={isValid}
        hasVerified={hasVerified}
        verificationMessage={verificationMessage}
        recipientName={recipientName}
        accountNumber={accountNumber}
      />

      {/* Provider Details Component */}
      <ProviderDetails providerDetails={providerDetails} />

      {/* Provider Instructions Component */}
      <ProviderInstructions instructions={providerDetails?.instructions} />
    </motion.div>
  );
};

export default ExpandedContent;
