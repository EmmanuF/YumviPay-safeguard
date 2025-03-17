
import React from 'react';
import { usePaymentStep } from '@/hooks/usePaymentStep';
import PaymentMethodList from './PaymentMethodList';
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import PaymentLoadingState from './payment/PaymentLoadingState';
import { isNextButtonDisabled } from '@/utils/paymentUtils';

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
    selectedCountry
  } = usePaymentStep({ transactionData, updateTransactionData });

  if (isLoading) {
    return <PaymentLoadingState />;
  }

  const handleContinue = () => {
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
      
      {selectedCountry && (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-6">
          <p className="text-amber-800 font-medium flex items-center">
            <span className="mr-2">💳</span>
            MTN MoMo and Orange Money wallets
          </p>
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
