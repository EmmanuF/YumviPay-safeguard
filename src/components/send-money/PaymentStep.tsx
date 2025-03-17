
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCountries } from '@/hooks/useCountries';
import PaymentMethodList from './PaymentMethodList';
import TransactionSummary from './TransactionSummary';
import { providerOptions, getProviderOptions } from './PaymentProviderData';

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
  const { getCountryByCode, countries } = useCountries();
  
  // Debug the countries data
  console.log("All Countries:", countries);
  console.log("Target Currency:", transactionData.targetCurrency);
  
  const selectedCountryData = getCountryByCode(transactionData.targetCurrency);
  console.log("Selected Country Data:", selectedCountryData);
  
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

  // Reset provider selection when payment method changes
  useEffect(() => {
    if (transactionData.paymentMethod && selectedCountryData) {
      // Get available providers for this payment method and country
      const providers = getProviderOptions(
        transactionData.paymentMethod, 
        selectedCountryData.code
      );
      
      console.log("Available providers:", providers);
      
      // If there are providers and we don't have one selected yet, select the first one
      if (providers.length > 0 && !transactionData.selectedProvider) {
        updateTransactionData({ selectedProvider: providers[0].id });
      }
    }
  }, [transactionData.paymentMethod, selectedCountryData, updateTransactionData, transactionData.selectedProvider]);

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
        selectedProvider={transactionData.selectedProvider}
        onSelectPaymentMethod={(method) => updateTransactionData({ 
          paymentMethod: method,
          selectedProvider: null  // Reset provider when method changes
        })}
        onSelectProvider={(providerId) => updateTransactionData({ 
          selectedProvider: providerId 
        })}
        providerOptions={providerOptions}
      />

      <TransactionSummary 
        amount={String(transactionData.amount)}
        selectedCountryData={selectedCountryData}
        selectedCountry={transactionData.targetCurrency}
        recipientName={transactionData.recipientName || ''}
        recipient={transactionData.recipient || ''}
        selectedPaymentMethod={transactionData.paymentMethod}
        selectedProvider={transactionData.selectedProvider}
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
          disabled={!transactionData.paymentMethod || !transactionData.selectedProvider}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStep;
