
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import PaymentMethodList from './PaymentMethodList';
import TransactionSummary from './TransactionSummary';
import { providerOptions, getProviderOptions } from './PaymentProviderData';
import PreferredPaymentMethods from './payment/PreferredPaymentMethods';
import SavePreferenceToggle from './payment/SavePreferenceToggle';
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import { usePaymentStep } from '@/hooks/usePaymentStep';
import { renderLoadingState, handlePaymentPreference, isNextButtonDisabled } from '@/utils/paymentUtils';

export interface PaymentStepProps {
  transactionData: {
    amount: number;
    sourceCurrency: string;
    targetCurrency: string;
    convertedAmount: number;
    recipient: string | null;
    recipientName?: string;
    paymentMethod: string | null;
    selectedProvider?: string;
    targetCountry?: string;
    savePaymentPreference?: boolean;
  };
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  transactionData,
  updateTransactionData,
  onNext,
  onBack
}) => {
  const { user } = useAuth();
  const { 
    isLoading, 
    countryCode, 
    selectedCountry, 
    savePreference, 
    handleToggleSavePreference 
  } = usePaymentStep({ 
    transactionData, 
    updateTransactionData 
  });
  
  console.log('PaymentStep - transactionData:', transactionData);
  console.log('PaymentStep - countryCode:', countryCode);
  console.log('PaymentStep - selectedCountry:', selectedCountry);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const preferredMethods = [
    { methodId: 'mobile_money', providerId: 'mtn_momo' },
    { methodId: 'mobile_money', providerId: 'orange_money' }
  ];

  const handleProceedToPayment = () => {
    handlePaymentPreference(savePreference, updateTransactionData);
    onNext();
  };

  if (isLoading) {
    return renderLoadingState();
  }

  const isNextDisabled = isNextButtonDisabled(transactionData, selectedCountry);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PreferredPaymentMethods 
        preferredMethods={preferredMethods}
        countryCode={countryCode}
        selectedCountry={selectedCountry}
        transactionData={transactionData}
        updateTransactionData={updateTransactionData}
      />

      <PaymentMethodList 
        selectedCountry={countryCode}
        selectedCountryData={selectedCountry}
        selectedPaymentMethod={transactionData.paymentMethod}
        selectedProvider={transactionData.selectedProvider}
        onSelectPaymentMethod={(method) => updateTransactionData({ 
          paymentMethod: method,
          selectedProvider: null 
        })}
        onSelectProvider={(providerId) => updateTransactionData({ 
          selectedProvider: providerId 
        })}
        providerOptions={providerOptions}
      />

      <TransactionSummary 
        amount={String(transactionData.amount)}
        selectedCountryData={selectedCountry}
        selectedCountry={countryCode}
        recipientName={transactionData.recipientName || ''}
        recipient={transactionData.recipient || ''}
        selectedPaymentMethod={transactionData.paymentMethod}
        selectedProvider={transactionData.selectedProvider}
      />

      {user && (
        <SavePreferenceToggle 
          savePreference={savePreference}
          handleToggleSavePreference={handleToggleSavePreference}
        />
      )}

      <PaymentStepNavigation 
        onNext={handleProceedToPayment}
        onBack={onBack}
        isNextDisabled={isNextDisabled}
      />
    </motion.div>
  );
};

export default PaymentStep;
