
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Shield, AlertTriangle, Clock, PiggyBank, Phone } from 'lucide-react';
import ProviderOptions from './ProviderOptions';
import RecipientInfo from './RecipientInfo';
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
  }, [recipientName, accountNumber, selectedOption, countryCode, hasVerified, toast]);

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

      {/* Provider-specific details and fees */}
      {providerDetails && (
        <div className="mt-4 space-y-3">
          {/* Processing time */}
          {providerDetails.processingTime && (
            <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800">Processing Time</h4>
                <p className="text-sm text-blue-700">
                  {providerDetails.processingTime}
                </p>
              </div>
            </div>
          )}
          
          {/* Fees information */}
          {providerDetails.fees && (
            <div className="p-3 bg-purple-50 rounded-lg flex items-start gap-2">
              <PiggyBank className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-purple-800">Transaction Fees</h4>
                <p className="text-sm text-purple-700">
                  {providerDetails.fees.percentage}% + {providerDetails.fees.fixed} {providerDetails.fees.currency}
                </p>
                {providerDetails.limits && (
                  <p className="text-xs text-purple-600 mt-1">
                    Transaction limits: {providerDetails.limits.min} - {providerDetails.limits.max} {providerDetails.limits.currency}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Support information */}
          {providerDetails.supportPhone && (
            <div className="p-3 bg-green-50 rounded-lg flex items-start gap-2">
              <Phone className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-800">Customer Support</h4>
                <p className="text-sm text-green-700">
                  {providerDetails.supportPhone}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Provider-specific instructions */}
      {providerDetails?.instructions && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Instructions:</h4>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
            {providerDetails.instructions.map((instruction, idx) => (
              <li key={idx}>{instruction}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ExpandedContent;
