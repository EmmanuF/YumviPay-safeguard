
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useCountries } from '@/hooks/useCountries';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import PaymentMethodList from './PaymentMethodList';
import TransactionSummary from './TransactionSummary';
import { providerOptions, getProviderOptions, getRecommendedPaymentMethods } from './PaymentProviderData';
import PreferredPaymentMethods from './payment/PreferredPaymentMethods';
import SavePreferenceToggle from './payment/SavePreferenceToggle';
import PaymentStepNavigation from './payment/PaymentStepNavigation';

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
  const { toast } = useToast();
  const { countries, getCountryByCode, isLoading } = useCountries();
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [savePreference, setSavePreference] = useState(transactionData.savePaymentPreference || false);
  
  const countryCode = transactionData.targetCountry || 
                     (countries.find(country => country.currency === transactionData.targetCurrency)?.code || 'CM');
  
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

  const preferredMethods = [
    { methodId: 'mobile_money', providerId: 'mtn_momo' },
    { methodId: 'mobile_money', providerId: 'orange_money' }
  ];

  useEffect(() => {
    if (!transactionData.targetCountry && countryCode && !isInitialized) {
      updateTransactionData({ targetCountry: countryCode });
      setIsInitialized(true);
      
      if (countryCode === 'CM' && !isLoading) {
        toast({
          title: "Cameroon Selected",
          description: "Cameroon is our primary supported country for this MVP."
        });
      }
    }
  }, [countryCode, transactionData.targetCountry, updateTransactionData, isInitialized, isLoading, toast]);

  useEffect(() => {
    if (transactionData.paymentMethod && countryCode) {
      if (countryCode === 'CM' && transactionData.paymentMethod === 'mobile_money' && !transactionData.selectedProvider) {
        updateTransactionData({ selectedProvider: 'mtn_momo' });
        return;
      }
      
      const providers = getProviderOptions(
        transactionData.paymentMethod, 
        countryCode
      );
      
      console.log('Available providers:', providers);
      
      if (providers.length > 0 && !transactionData.selectedProvider) {
        const recommended = getRecommendedProviders(transactionData.paymentMethod)[0];
        updateTransactionData({ 
          selectedProvider: recommended?.id || providers[0].id 
        });
        console.log('Auto-selected provider:', recommended?.id || providers[0].id);
      }
    }
  }, [transactionData.paymentMethod, countryCode, updateTransactionData, transactionData.selectedProvider]);

  const handleProceedToPayment = () => {
    if (savePreference) {
      updateTransactionData({ savePaymentPreference: true });
      toast({
        title: "Payment preference saved",
        description: "Your preferred payment method has been saved for future transactions"
      });
    }
    
    toast({
      title: "Processing payment",
      description: "Redirecting to payment gateway"
    });
    onNext();
  };

  const handleToggleSavePreference = (checked: boolean) => {
    setSavePreference(checked);
    updateTransactionData({ savePaymentPreference: checked });
  };

  if (isLoading) {
    return renderLoadingState();
  }

  const isNextDisabled = !transactionData.paymentMethod || 
                         !transactionData.selectedProvider || 
                         !selectedCountry || 
                         !selectedCountry.paymentMethods || 
                         selectedCountry.paymentMethods.length === 0;

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

// Helper function for loading state
const renderLoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-gray-600">Loading payment options...</p>
    </div>
  );
};

// Helper function to get recommended providers for a payment method
export const getRecommendedProviders = (methodId: string) => {
  if (methodId === 'mobile_money') {
    return [
      { id: 'mtn_momo', name: 'MTN Mobile Money' },
      { id: 'orange_money', name: 'Orange Money' }
    ];
  }
  
  return [];
};

export default PaymentStep;
