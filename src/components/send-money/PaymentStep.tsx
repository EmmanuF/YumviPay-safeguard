
import React from 'react';
import { Button } from "@/components/ui/button";
import { usePaymentStep } from '@/hooks/usePaymentStep';
import { useToast } from '@/hooks/use-toast';
import PaymentMethodList from './PaymentMethodList';
import PreferredPaymentMethods from './payment/PreferredPaymentMethods';
import SavePreferenceToggle from './payment/SavePreferenceToggle';
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import PaymentLoadingState from './payment/PaymentLoadingState';
import { handlePaymentPreference, isNextButtonDisabled, getProviderOptions } from '@/utils/paymentUtils';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import QRCodeOption from './payment/QRCodeOption';

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
  const { toast } = useToast();
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
    
    // Show a toast message when continuing
    if (transactionData.paymentMethod && transactionData.selectedProvider) {
      const methodName = selectedCountry?.paymentMethods.find(m => m.id === transactionData.paymentMethod)?.name || "payment method";
      const providerOptions = getProviderOptions(transactionData.paymentMethod, countryCode);
      const providerName = providerOptions.find((p: any) => p.id === transactionData.selectedProvider)?.name || "";
      
      toast({
        title: "Payment method selected",
        description: `You'll be using ${providerName} ${methodName} for this transaction`,
      });
    }
    
    onNext();
  };

  const handleQRScanComplete = (qrData: any) => {
    if (qrData && qrData.id) {
      toast({
        title: "QR Code Scanned",
        description: `Transaction details loaded from QR code`,
      });
      
      // Update transaction data with QR information
      updateTransactionData({
        qrCodeData: qrData,
        amount: qrData.amount || transactionData.amount,
        recipientName: qrData.recipient || transactionData.recipientName,
      });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-1"
      >
        <h2 className="text-2xl font-semibold text-gray-900">Payment Method</h2>
        <p className="text-sm text-gray-600">
          Choose how you would like to pay for this transaction.
        </p>
      </motion.div>

      {/* QR Code Option */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <QRCodeOption 
          transactionData={transactionData}
          onScanComplete={handleQRScanComplete}
        />
      </motion.div>

      {preferredMethods.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-2"
        >
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <span>Your saved payment methods</span>
            <Info className="h-4 w-4 ml-1 text-primary-400" />
          </h3>
          <PreferredPaymentMethods
            preferredMethods={preferredMethods}
            countryCode={countryCode}
            selectedCountry={selectedCountry}
            transactionData={transactionData}
            updateTransactionData={updateTransactionData}
          />
        </motion.div>
      )}
      
      {selectedCountry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <PaymentMethodList
            paymentMethods={selectedCountry.paymentMethods || []}
            selectedMethod={transactionData.paymentMethod}
            selectedProvider={transactionData.selectedProvider}
            onSelect={(method) => updateTransactionData({ paymentMethod: method })}
            onSelectProvider={(provider) => updateTransactionData({ selectedProvider: provider })}
            countryCode={countryCode}
          />
        </motion.div>
      )}

      {transactionData.paymentMethod && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <SavePreferenceToggle 
            checked={savePreference}
            onChange={handleToggleSavePreference}
          />
        </motion.div>
      )}

      {/* Security information card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3"
      >
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-blue-800">Transaction Security</h4>
          <p className="text-xs text-blue-700 mt-1">
            Your payment information is securely processed. For added protection, transactions above 100,000 XAF may require additional verification.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <PaymentStepNavigation
          onBack={onBack}
          isNextDisabled={isNextButtonDisabled(transactionData, selectedCountry)}
          isSubmitting={isSubmitting}
          onNext={handleContinue}
        />
      </motion.div>
    </div>
  );
};

export default PaymentStep;
