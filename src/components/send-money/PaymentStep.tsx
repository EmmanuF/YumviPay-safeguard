
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCountries } from '@/hooks/useCountries';
import PaymentMethodList from './PaymentMethodList';
import TransactionSummary from './TransactionSummary';
import { providerOptions, getProviderOptions } from './PaymentProviderData';
import { Loader2 } from 'lucide-react';

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
  const { countries, getCountryByCode, isLoading } = useCountries();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // The country code to use - either from targetCountry or found by currency
  const countryCode = transactionData.targetCountry || 
                     (countries.find(country => country.currency === transactionData.targetCurrency)?.code || 'CM');
  
  // Find the selected country data
  const selectedCountry = getCountryByCode(countryCode);
  
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Ensure we have a targetCountry set
  useEffect(() => {
    if (!transactionData.targetCountry && countryCode && !isInitialized) {
      updateTransactionData({ targetCountry: countryCode });
      setIsInitialized(true);
    }
  }, [countryCode, transactionData.targetCountry, updateTransactionData, isInitialized]);

  // Reset provider selection when payment method changes
  useEffect(() => {
    if (transactionData.paymentMethod && countryCode) {
      // Get available providers for this payment method and country
      const providers = getProviderOptions(
        transactionData.paymentMethod, 
        countryCode
      );
      
      console.log('Available providers:', providers);
      
      // If there are providers and we don't have one selected yet, select the first one
      if (providers.length > 0 && !transactionData.selectedProvider) {
        updateTransactionData({ selectedProvider: providers[0].id });
        console.log('Auto-selected provider:', providers[0].id);
      }
    }
  }, [transactionData.paymentMethod, countryCode, updateTransactionData, transactionData.selectedProvider]);

  const handleProceedToPayment = () => {
    toast({
      title: "Processing payment",
      description: "Redirecting to payment gateway",
      duration: 3000,
    });
    onNext();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-gray-600">Loading payment options...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PaymentMethodList 
        selectedCountry={countryCode}
        selectedCountryData={selectedCountry}
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
        selectedCountryData={selectedCountry}
        selectedCountry={countryCode}
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
          disabled={!transactionData.paymentMethod || !transactionData.selectedProvider || !selectedCountry || !selectedCountry.paymentMethods || selectedCountry.paymentMethods.length === 0}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStep;
