
import React from 'react';
import { Button } from "@/components/ui/button";
import { usePaymentStep } from '@/hooks/usePaymentStep';
import PaymentMethodList from './PaymentMethodList';
import PreferredPaymentMethods from './payment/PreferredPaymentMethods';
import SavePreferenceToggle from './payment/SavePreferenceToggle';
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import PaymentLoadingState from './payment/PaymentLoadingState';
import { handlePaymentPreference, isNextButtonDisabled } from '@/utils/paymentUtils';

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
  isSubmitting: boolean;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  onNext,
  onBack,
  transactionData,
  updateTransactionData,
  isSubmitting,
}) => {
  const {
    isLoading,
    countryCode,
    selectedCountry,
    savePreference,
    handleToggleSavePreference
  } = usePaymentStep({ transactionData, updateTransactionData });

  if (isLoading) {
    return <PaymentLoadingState />;
  }

  // Get user's preferred payment methods (if any)
  const preferredMethods = transactionData.user?.preferences?.paymentMethods || [];

  const handleContinue = () => {
    handlePaymentPreference(savePreference, updateTransactionData);
    onNext();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900">Payment Method</h2>
        <p className="text-sm text-gray-600">
          Choose how you would like to pay for this transaction.
        </p>
      </div>

      {preferredMethods.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Your saved payment methods</h3>
          <PreferredPaymentMethods
            preferredMethods={preferredMethods}
            countryCode={countryCode}
            selectedCountry={selectedCountry}
            transactionData={transactionData}
            updateTransactionData={updateTransactionData}
          />
        </div>
      )}
      
      {selectedCountry && (
        <PaymentMethodList
          paymentMethods={selectedCountry.paymentMethods || []}
          selectedMethod={transactionData.paymentMethod}
          selectedProvider={transactionData.selectedProvider}
          onSelect={(method) => updateTransactionData({ paymentMethod: method })}
          onSelectProvider={(provider) => updateTransactionData({ selectedProvider: provider })}
          countryCode={countryCode}
        />
      )}

      <SavePreferenceToggle 
        checked={savePreference}
        onChange={handleToggleSavePreference}
      />

      <PaymentStepNavigation
        onBack={onBack}
        isNextDisabled={isNextButtonDisabled(transactionData, selectedCountry)}
        isSubmitting={isSubmitting}
        onNext={handleContinue}
      />
    </div>
  );
};

export default PaymentStep;
