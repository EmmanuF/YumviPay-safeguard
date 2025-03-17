
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useCountries } from '@/hooks/useCountries';
import PaymentMethodSelection from './payment-step/PaymentMethodSelection';
import PaymentOptionsPanel from './payment-step/PaymentOptionsPanel';
import RecurringPaymentPanel from './payment-step/RecurringPaymentPanel';
import PaymentStepActions from './payment-step/PaymentStepActions';
import { validatePaymentSelection, setupRecurringPayment } from './payment-step/validatePaymentSelection';

interface PaymentStepProps {
  transactionData: {
    amount: number;
    sourceCurrency: string;
    targetCurrency: string;
    convertedAmount: number;
    recipient: string | null;
    recipientName?: string;
    recipientCountry?: string;
    paymentMethod: string | null;
    selectedProvider?: string;
  };
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  transactionData,
  updateTransactionData,
  onNext,
  onBack,
  isSubmitting = false
}) => {
  const { toast } = useToast();
  const { getCountryByCode } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [preferredMethods, setPreferredMethods] = useState<Array<{ methodId: string; providerId: string }>>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [isDetailsConfirmed, setIsDetailsConfirmed] = useState(false);
  const [showConfirmationError, setShowConfirmationError] = useState(false);
  
  const comingSoonProviders = ['yoomee_money', 'afriland', 'ecobank'];
  const comingSoonMethods = ['bank_transfer'];
  
  useEffect(() => {
    if (transactionData.recipientCountry) {
      const country = getCountryByCode(transactionData.recipientCountry);
      setSelectedCountry(country);
    }
  }, [transactionData.recipientCountry, getCountryByCode]);

  const handleRecurringChange = (isRecurring: boolean, frequency: string) => {
    setIsRecurring(isRecurring);
    setRecurringFrequency(frequency);
    
    updateTransactionData({
      isRecurring,
      recurringFrequency: isRecurring ? frequency : null
    });
  };

  const handleConfirmationChange = (checked: boolean) => {
    setIsDetailsConfirmed(checked);
    if (checked) {
      setShowConfirmationError(false);
    }
  };

  const handleContinue = async () => {
    // Validate the payment selection
    const validationResult = validatePaymentSelection(
      transactionData.paymentMethod,
      transactionData.selectedProvider,
      isDetailsConfirmed,
      comingSoonMethods,
      comingSoonProviders
    );
    
    if (!validationResult.isValid) {
      if (validationResult.errorToast) {
        toast(validationResult.errorToast);
      }
      
      if (!isDetailsConfirmed) {
        setShowConfirmationError(true);
      }
      
      return;
    }
    
    // Set up recurring payment if needed
    if (isRecurring) {
      const recurringResult = await setupRecurringPayment(
        isRecurring,
        transactionData,
        recurringFrequency
      );
      
      toast({
        title: recurringResult.success ? "Recurring payment scheduled" : "Couldn't schedule recurring payment",
        description: recurringResult.message,
        variant: recurringResult.success ? "default" : "destructive",
      });
    }
    
    onNext();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Payment options panel with favorites and preferred methods */}
      <PaymentOptionsPanel
        transactionData={transactionData}
        updateTransactionData={updateTransactionData}
        preferredMethods={preferredMethods}
        selectedCountry={selectedCountry}
      />
      
      {/* Payment method selection */}
      <PaymentMethodSelection
        transactionData={transactionData}
        updateTransactionData={updateTransactionData}
        isDetailsConfirmed={isDetailsConfirmed}
        onConfirmationChange={handleConfirmationChange}
        showConfirmationError={showConfirmationError}
      />
      
      {/* Recurring payment options */}
      <RecurringPaymentPanel
        transactionData={transactionData}
        onRecurringChange={handleRecurringChange}
      />
      
      {/* Navigation buttons */}
      <PaymentStepActions
        onNext={handleContinue}
        onBack={onBack}
        isSubmitting={isSubmitting}
        isPaymentMethodSelected={!!transactionData.paymentMethod}
      />
    </motion.div>
  );
};

export default PaymentStep;
