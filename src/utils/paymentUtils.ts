import { getProvidersByMethod, getRecommendedProviders } from '@/data/cameroonPaymentProviders';

// Initialize payment data when country is selected
export const initializePaymentData = (
  countryCode: string,
  transactionData: any,
  updateTransactionData: (data: any) => void,
  isInitialized: boolean,
  isLoading: boolean
): boolean => {
  if (isLoading || isInitialized || !countryCode) {
    return false;
  }

  console.log('Initializing payment data for country:', countryCode);
  
  // For MVP we're focusing on Cameroon
  if (countryCode === 'CM') {
    updateTransactionData({
      recipientCountry: countryCode,
      paymentMethod: 'mobile_money',
    });
    return true;
  }
  
  return false;
};

// Initialize provider selection based on payment method
export const initializeProviderSelection = (
  transactionData: any,
  countryCode: string,
  updateTransactionData: (data: any) => void,
  getProviderOptions: (methodId: string, countryCode: string) => any[],
  getRecommendedProviders: (countryCode: string) => string[]
) => {
  const { paymentMethod, selectedProvider } = transactionData;
  
  // Check if we need to initialize a provider
  if (paymentMethod && !selectedProvider) {
    // Get all providers for this payment method
    const providers = getProviderOptions(paymentMethod, countryCode);
    
    // Get recommended providers
    const recommended = getRecommendedProviders(countryCode);
    
    if (providers && providers.length > 0) {
      // Find a recommended provider first
      const recommendedProvider = providers.find(p => recommended.includes(p.id));
      
      // If found, use the recommended provider, otherwise use the first one
      const provider = recommendedProvider || providers[0];
      
      console.log('Setting default provider for', paymentMethod, ':', provider.id);
      updateTransactionData({ selectedProvider: provider.id });
    }
  }
};

// Get provider options for a payment method and country
export const getProviderOptions = (methodId: string, countryCode: string) => {
  const providers = getProvidersByMethod(methodId);
  
  // Map to format needed by components
  return providers
    .filter(provider => provider.isAvailable) // Only include available providers
    .map(provider => ({
      id: provider.id,
      name: provider.name,
      logoUrl: provider.logoUrl,
      description: provider.description,
      isRecommended: provider.isRecommended,
    }));
};

// Calculate transaction fee based on amount, payment method and provider
export const calculateTransactionFee = (
  amount: number,
  paymentMethod: string,
  providerId: string
): number => {
  // For MVP, we're keeping a flat fee structure
  const feeRates: Record<string, number> = {
    mobile_money: 0.012, // 1.2%
    bank_transfer: 0.015, // 1.5%
    mtn_mobile_money: 0.012, // 1.2%
    orange_money: 0.012, // 1.2%
  };
  
  // Get the fee rate based on payment method or provider
  const feeRate = feeRates[providerId] || feeRates[paymentMethod] || 0.012;
  
  // Calculate fee
  return amount * feeRate;
};

// Get estimated delivery time for a payment method and provider
export const getEstimatedDeliveryTime = (
  paymentMethod: string,
  providerId: string
): string => {
  const deliveryTimes: Record<string, string> = {
    mobile_money: 'Instant',
    bank_transfer: '1-2 business days',
    mtn_mobile_money: 'Instant',
    orange_money: 'Instant',
  };
  
  return deliveryTimes[providerId] || deliveryTimes[paymentMethod] || 'Instant';
};
