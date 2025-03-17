
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Shield, AlertTriangle } from 'lucide-react';
import ProviderOptions from './ProviderOptions';
import RecipientInfo from './RecipientInfo';
import { useLocale } from '@/contexts/LocaleContext';
import { getProviderById } from '@/data/cameroonPaymentProviders';
import { verifyRecipient } from '@/utils/recipientUtils';
import { toast } from 'sonner';

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
        toast("Recipient information valid", {
          description: "The recipient information format has been verified",
          className: "bg-green-50 border-green-200"
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
      className="mt-4 p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
    >
      <h3 className="text-lg font-medium mb-4 text-center">Recipient</h3>
      
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

      {/* Verification status */}
      {hasVerified && isValid && recipientName && accountNumber && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-start gap-2">
          <Shield className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800">Verification Passed</h4>
            <p className="text-sm text-green-700">
              The recipient information format has been verified.
            </p>
          </div>
        </div>
      )}

      {verificationMessage && !isValid && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Verification Issue</h4>
            <p className="text-sm text-amber-700">{verificationMessage}</p>
          </div>
        </div>
      )}

      {/* Provider-specific instructions */}
      {providerDetails?.instructions && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-2">Instructions:</h4>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-2">
            {providerDetails.instructions.map((instruction, idx) => (
              <li key={idx}>{instruction}</li>
            ))}
          </ul>
          {providerDetails.processingTime && (
            <p className="mt-3 text-xs text-blue-600 font-medium">
              Estimated processing time: {providerDetails.processingTime}
            </p>
          )}
          {providerDetails.supportPhone && (
            <p className="mt-1 text-xs text-blue-600">
              Support: {providerDetails.supportPhone}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ExpandedContent;
