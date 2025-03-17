
import { toast } from "@/hooks/use-toast";
import { Country } from "@/hooks/useCountries";
import { cameroonPaymentMethods, getPaymentMethodById } from "@/data/cameroonPaymentProviders";

// Function to initialize payment data
export const initializePaymentData = (
  countryCode: string, 
  transactionData: any, 
  updateTransactionData: (data: Partial<any>) => void,
  isInitialized: boolean,
  isLoading: boolean
) => {
  if (!transactionData.targetCountry && countryCode && !isInitialized) {
    updateTransactionData({ targetCountry: countryCode });
    
    if (countryCode === 'CM' && !isLoading) {
      toast({
        title: "Cameroon Selected",
        description: "Cameroon is our primary supported country for this MVP."
      });
    }
    return true;
  }
  return false;
};

// Function to initialize provider selection
export const initializeProviderSelection = (
  transactionData: any,
  countryCode: string,
  updateTransactionData: (data: Partial<any>) => void,
  getProviderOptions: (methodId: string, countryCode: string) => Array<{id: string; name: string}>,
  getRecommendedProviders: (methodId: string) => Array<{id: string; name: string}>
) => {
  if (transactionData.paymentMethod && countryCode) {
    // For Cameroon, set default providers based on payment method
    if (countryCode === 'CM') {
      if (transactionData.paymentMethod === 'mobile_money' && !transactionData.selectedProvider) {
        updateTransactionData({ selectedProvider: 'mtn_momo' });
        return;
      } else if (transactionData.paymentMethod === 'bank_transfer' && !transactionData.selectedProvider) {
        updateTransactionData({ selectedProvider: 'ecobank' });
        return;
      } else if (transactionData.paymentMethod === 'cash_pickup' && !transactionData.selectedProvider) {
        updateTransactionData({ selectedProvider: 'express_union' });
        return;
      }
    }
    
    const providers = getProviderOptions(
      transactionData.paymentMethod, 
      countryCode
    );
    
    if (providers.length > 0 && !transactionData.selectedProvider) {
      const recommended = getRecommendedProviders(transactionData.paymentMethod)[0];
      updateTransactionData({ 
        selectedProvider: recommended?.id || providers[0].id 
      });
    }
  }
};

// Function to handle payment preference
export const handlePaymentPreference = (
  savePreference: boolean,
  updateTransactionData: (data: Partial<any>) => void
) => {
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
};

// Function to check if next button should be disabled
export const isNextButtonDisabled = (
  transactionData: any,
  selectedCountry: Country | undefined
) => {
  return !transactionData.paymentMethod || 
         !transactionData.selectedProvider || 
         !selectedCountry || 
         !selectedCountry.paymentMethods || 
         selectedCountry.paymentMethods.length === 0;
};

// Function to get provider options for the selected payment method and country
export const getProviderOptions = (methodId: string, countryCode: string) => {
  // For Cameroon, get providers from cameroonPaymentMethods
  if (countryCode === 'CM') {
    const method = getPaymentMethodById(methodId);
    if (method && method.providers.length > 0) {
      return method.providers.map(provider => ({
        id: provider.id,
        name: provider.name
      }));
    }
  }
  
  // Fallback to static options if needed
  const providerOptions = {
    mobile_money: {
      CM: [
        { id: 'mtn_momo', name: 'MTN Mobile Money' },
        { id: 'orange_money', name: 'Orange Money' },
        { id: 'yoomee_money', name: 'YooMee Money' }
      ],
      default: []
    },
    bank_transfer: {
      CM: [
        { id: 'ecobank', name: 'Ecobank' },
        { id: 'afriland', name: 'Afriland First Bank' }
      ],
      default: []
    },
    cash_pickup: {
      CM: [
        { id: 'express_union', name: 'Express Union' },
        { id: 'emi_money', name: 'EMI Money' }
      ],
      default: []
    }
  };
  
  // For Cameroon, return method-specific providers
  if (countryCode === 'CM') {
    if (methodId === 'mobile_money') {
      return providerOptions.mobile_money.CM;
    } else if (methodId === 'bank_transfer') {
      return providerOptions.bank_transfer.CM;
    } else if (methodId === 'cash_pickup') {
      return providerOptions.cash_pickup.CM;
    }
  }
  
  // For other methods/countries, use standard logic
  const methodProviders = providerOptions[methodId as keyof typeof providerOptions];
  if (!methodProviders) {
    return [];
  }
  
  // First try to get country-specific providers, then fall back to default
  const providers = methodProviders[countryCode as keyof typeof methodProviders] || 
                   methodProviders.CM || 
                   methodProviders.default || 
                   [];
  
  return providers;
};

// Calculate fees based on payment method and amount
export const calculateTransactionFee = (
  amount: number, 
  paymentMethod: string, 
  providerId: string
): number => {
  if (!paymentMethod || !providerId) return 0;
  
  const method = getPaymentMethodById(paymentMethod);
  if (!method) return 0;
  
  const provider = method.providers.find(p => p.id === providerId);
  if (!provider || !provider.fees) return 0;
  
  // Calculate fee using provider's fee structure
  const percentageFee = amount * (provider.fees.percentage / 100);
  const fixedFee = provider.fees.fixed;
  
  return percentageFee + fixedFee;
};

// Get estimated delivery time based on payment method and provider
export const getEstimatedDeliveryTime = (
  paymentMethod: string,
  providerId: string
): string => {
  if (!paymentMethod || !providerId) return 'Unknown';
  
  const method = getPaymentMethodById(paymentMethod);
  if (!method) return 'Unknown';
  
  const provider = method.providers.find(p => p.id === providerId);
  
  return provider?.processingTime || 'Unknown';
};
