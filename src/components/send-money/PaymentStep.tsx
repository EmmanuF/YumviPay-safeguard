
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCountries } from '@/hooks/useCountries';
import PaymentMethodList from './PaymentMethodList';
import TransactionSummary from './TransactionSummary';
import { providerOptions } from './PaymentProviderData';

interface PaymentStepProps {
  transactionData: {
    amount: number;
    sourceCurrency: string;
    targetCurrency: string;
    convertedAmount: number;
    recipient: string | null;
    recipientName?: string;
    paymentMethod: string | null;
    selectedProvider?: string;
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
  const { toast } = useToast();
  const { getCountryByCode } = useCountries();
  const selectedCountryData = getCountryByCode(transactionData.targetCurrency);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const handleProceedToPayment = () => {
    toast({
      title: "Processing payment",
      description: "Redirecting to payment gateway",
      duration: 3000,
    });
    onNext();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PaymentMethodList 
        selectedCountry={transactionData.targetCurrency}
        selectedCountryData={selectedCountryData}
        selectedPaymentMethod={transactionData.paymentMethod}
        onSelectPaymentMethod={(method) => updateTransactionData({ paymentMethod: method })}
        providerOptions={providerOptions}
      />

      <TransactionSummary 
        amount={String(transactionData.amount)}
        selectedCountryData={selectedCountryData}
        selectedCountry={transactionData.targetCurrency}
        recipientName={transactionData.recipientName || ''}
        recipient={transactionData.recipient || ''}
        selectedPaymentMethod={transactionData.paymentMethod}
      />

      <motion.div variants={itemVariants} className="pt-4 flex space-x-3">
        <Button 
          variant="outline"
          onClick={onBack} 
          className="w-1/2" 
          size="lg"
        >
          Back
        </Button>
        <Button 
          onClick={handleProceedToPayment} 
          className="w-1/2" 
          size="lg"
          disabled={!transactionData.paymentMethod || !selectedCountryData || selectedCountryData.paymentMethods.length === 0}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStep;
