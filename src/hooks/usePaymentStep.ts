
import { useState, useEffect } from 'react';
import { useCountries } from '@/hooks/useCountries';
import { initializePaymentData, initializeProviderSelection, getProviderOptions } from '@/utils/paymentUtils';

interface UsePaymentStepProps {
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
}

export const usePaymentStep = ({ transactionData, updateTransactionData }: UsePaymentStepProps) => {
  const { countries, getCountryByCode, isLoading } = useCountries();
  const [isInitialized, setIsInitialized] = useState(false);
  const [savePreference, setSavePreference] = useState(transactionData.savePaymentPreference || false);
  
  const countryCode = transactionData.targetCountry || 
                     (countries.find(country => country.currency === transactionData.targetCurrency)?.code || 'CM');
  
  const selectedCountry = getCountryByCode(countryCode);
  
  // Initialize country data
  useEffect(() => {
    const initialized = initializePaymentData(
      countryCode, 
      transactionData, 
      updateTransactionData, 
      isInitialized, 
      isLoading
    );
    
    if (initialized) {
      setIsInitialized(true);
    }
  }, [countryCode, transactionData.targetCountry, updateTransactionData, isInitialized, isLoading]);

  // Initialize provider selection
  useEffect(() => {
    initializeProviderSelection(
      transactionData,
      countryCode,
      updateTransactionData,
      getProviderOptions,
      getRecommendedProviders
    );
  }, [transactionData.paymentMethod, countryCode, updateTransactionData, transactionData.selectedProvider]);

  const handleToggleSavePreference = (checked: boolean) => {
    setSavePreference(checked);
    updateTransactionData({ savePaymentPreference: checked });
  };

  return {
    isLoading,
    countryCode,
    selectedCountry,
    savePreference,
    handleToggleSavePreference
  };
};

// Helper function to get recommended providers for a payment method
const getRecommendedProviders = (methodId: string) => {
  if (methodId === 'mobile_money') {
    return [
      { id: 'mtn_momo', name: 'MTN Mobile Money' },
      { id: 'orange_money', name: 'Orange Money' }
    ];
  }
  
  return [];
};
