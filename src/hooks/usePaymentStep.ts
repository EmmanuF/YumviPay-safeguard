
import { useState, useEffect } from 'react';
import { useCountries } from '@/hooks/useCountries';
import { 
  initializePaymentData, 
  initializeProviderSelection, 
  getProviderOptions,
  calculateTransactionFee,
  getEstimatedDeliveryTime
} from '@/utils/paymentUtils';
import { getRecommendedProviders } from '@/data/cameroonPaymentProviders';
import { useToast } from '@/hooks/use-toast';

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
    user?: any;
  };
  updateTransactionData: (data: Partial<any>) => void;
}

export const usePaymentStep = ({ transactionData, updateTransactionData }: UsePaymentStepProps) => {
  const { countries, getCountryByCode, isLoading } = useCountries();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [savePreference, setSavePreference] = useState(transactionData.savePaymentPreference || false);
  
  console.log("DEBUG - usePaymentStep - Initial transaction data:", JSON.stringify(transactionData, null, 2));
  
  const countryCode = transactionData.targetCountry || 
                     (countries.find(country => country.currency === transactionData.targetCurrency)?.code || 'CM');
  
  console.log(`DEBUG - usePaymentStep - Resolved country code: "${countryCode}"`);
  
  const selectedCountry = getCountryByCode(countryCode);
  console.log("DEBUG - usePaymentStep - Selected country:", selectedCountry);
  
  // Initialize country data
  useEffect(() => {
    console.log("DEBUG - usePaymentStep - Initializing payment data:", {
      countryCode,
      isInitialized,
      isLoading
    });
    
    const initialized = initializePaymentData(
      countryCode, 
      transactionData, 
      updateTransactionData, 
      isInitialized, 
      isLoading
    );
    
    if (initialized) {
      console.log("DEBUG - usePaymentStep - Payment data initialized successfully");
      setIsInitialized(true);
    } else {
      console.log("DEBUG - usePaymentStep - Payment data initialization skipped");
    }
  }, [countryCode, transactionData.targetCountry, updateTransactionData, isInitialized, isLoading]);

  // Initialize provider selection
  useEffect(() => {
    console.log("DEBUG - usePaymentStep - Initializing provider selection:", {
      paymentMethod: transactionData.paymentMethod,
      countryCode,
      selectedProvider: transactionData.selectedProvider
    });
    
    initializeProviderSelection(
      transactionData,
      countryCode,
      updateTransactionData,
      getProviderOptions,
      getRecommendedProviders
    );
  }, [transactionData.paymentMethod, countryCode, updateTransactionData, transactionData.selectedProvider]);

  // Calculate fee and delivery time when payment method or provider changes
  useEffect(() => {
    if (transactionData.paymentMethod && transactionData.selectedProvider && transactionData.amount) {
      // Calculate fee
      const fee = calculateTransactionFee(
        transactionData.amount,
        transactionData.paymentMethod,
        transactionData.selectedProvider
      );
      
      // Get estimated delivery time
      const estimatedDelivery = getEstimatedDeliveryTime(
        transactionData.paymentMethod,
        transactionData.selectedProvider
      );
      
      // Update transaction data with fee and delivery time
      updateTransactionData({ 
        fee: fee.toFixed(2),
        estimatedDelivery 
      });
    }
  }, [transactionData.paymentMethod, transactionData.selectedProvider, transactionData.amount, updateTransactionData]);

  const handleToggleSavePreference = (checked: boolean) => {
    setSavePreference(checked);
    updateTransactionData({ savePaymentPreference: checked });
    
    if (checked) {
      toast({
        title: "Preference will be saved",
        description: "This payment method will be saved for future use"
      });
    }
  };

  return {
    isLoading,
    countryCode,
    selectedCountry,
    savePreference,
    handleToggleSavePreference
  };
};
