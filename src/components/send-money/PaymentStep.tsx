import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { useCountries } from '@/hooks/useCountries';
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import CountryPaymentMethods from './payment/CountryPaymentMethods';
import NameMatchConfirmation from './payment/NameMatchConfirmation';
import { usePaymentStep } from '@/hooks/usePaymentStep';
import RecurringPaymentOption from './payment/RecurringPaymentOption';
import SavePreferenceToggle from './payment/SavePreferenceToggle';

interface PaymentStepProps {
  transactionData: any;
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
  // State
  const [selectedMethod, setSelectedMethod] = useState<string>(transactionData?.paymentMethod || '');
  const [selectedProvider, setSelectedProvider] = useState<string>(transactionData?.selectedProvider || '');
  const [isRecurring, setIsRecurring] = useState<boolean>(transactionData?.isRecurring || false);
  const [recurringFrequency, setRecurringFrequency] = useState<string>(transactionData?.recurringFrequency || 'monthly');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(transactionData?.termsAccepted || false);
  
  // Custom hooks
  const { savePreference, handleToggleSavePreference } = usePaymentStep({
    transactionData,
    updateTransactionData
  });
  
  // Animation variants with staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  // Update transaction data when selections change
  useEffect(() => {
    if (selectedMethod || selectedProvider || isRecurring) {
      updateTransactionData({
        paymentMethod: selectedMethod,
        selectedProvider: selectedProvider,
        isRecurring: isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : undefined,
        termsAccepted: termsAccepted
      });
    }
  }, [selectedMethod, selectedProvider, isRecurring, recurringFrequency, termsAccepted, updateTransactionData]);

  // Handle method and provider selection via CountryPaymentMethods
  const handlePaymentSelect = (methodId: string, providerId: string) => {
    console.log(`Selected method: ${methodId}, provider: ${providerId}`);
    setSelectedMethod(methodId);
    setSelectedProvider(providerId);
  };

  // Handle recurring payment option
  const handleRecurringChange = (checked: boolean, frequency: string) => {
    setIsRecurring(checked);
    setRecurringFrequency(frequency);
  };

  // Check if next button should be enabled
  const isNextDisabled = !selectedMethod || !selectedProvider || !termsAccepted;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="glass-effect border-primary-100/30 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <motion.h2 
              className="text-2xl font-bold text-center text-gradient-primary mb-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.1 } }}
            >
              Choose Payment Method
            </motion.h2>
            <motion.p 
              className="text-center text-muted-foreground mb-8"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            >
              Select how you'd like to pay for this transfer
            </motion.p>

            {/* Country-specific payment methods */}
            <motion.div 
              variants={itemVariants}
              className="mb-8"
            >
              <CountryPaymentMethods
                countryCode={transactionData?.targetCountry || 'CM'}
                selectedPaymentMethod={selectedMethod}
                selectedProvider={selectedProvider}
                onSelect={handlePaymentSelect}
              />
            </motion.div>

            {/* Recurring Payment Option */}
            <motion.div variants={itemVariants} className="mb-6">
              <RecurringPaymentOption
                transactionData={transactionData}
                onRecurringChange={handleRecurringChange}
              />
            </motion.div>

            {/* Save Payment Preference */}
            <motion.div variants={itemVariants} className="mb-6">
              <SavePreferenceToggle
                checked={savePreference}
                onChange={handleToggleSavePreference}
              />
            </motion.div>

            {/* Terms and Conditions Confirmation */}
            <motion.div 
              variants={itemVariants}
              className="mb-6 relative overflow-hidden"
            >
              <NameMatchConfirmation
                isChecked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                showError={!termsAccepted && isSubmitting}
                variant="payment"
              />
            </motion.div>

            {/* Navigation Buttons */}
            <PaymentStepNavigation
              onNext={onNext}
              onBack={onBack}
              isNextDisabled={isNextDisabled}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStep;
