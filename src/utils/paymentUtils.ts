
import { getProvidersByMethod, getRecommendedProviders } from '@/data/cameroonPaymentProviders';

// Utility function to normalize method IDs (handle both dash and underscore formats)
const normalizeMethodId = (methodId: string): string => {
  // Convert dashes to underscores for consistent processing
  return methodId.replace(/-/g, '_');
};

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
  
  console.log(`DEBUG - initializeProviderSelection called with:`, {
    paymentMethod,
    selectedProvider,
    countryCode
  });
  
  // Check if we need to initialize a provider
  if (paymentMethod && !selectedProvider) {
    // Get all providers for this payment method
    const providers = getProviderOptions(paymentMethod, countryCode);
    
    console.log(`DEBUG - Provider options for ${paymentMethod}:`, providers);
    
    // Get recommended providers
    const recommended = getRecommendedProviders(countryCode);
    console.log(`DEBUG - Recommended providers:`, recommended);
    
    if (providers && providers.length > 0) {
      // Find a recommended provider first
      const recommendedProvider = providers.find(p => recommended.includes(p.id));
      
      // If found, use the recommended provider, otherwise use the first one
      const provider = recommendedProvider || providers[0];
      
      console.log('Setting default provider for', paymentMethod, ':', provider.id);
      updateTransactionData({ selectedProvider: provider.id });
    } else {
      console.log(`DEBUG - No providers found for method ${paymentMethod}`);
    }
  }
};

// Get provider options for a payment method and country
export const getProviderOptions = (methodId: string, countryCode: string) => {
  console.log(`DEBUG - getProviderOptions called with methodId: "${methodId}", countryCode: "${countryCode}"`);
  
  // Normalize methodId to handle both dash and underscore formats
  const normalizedMethodId = normalizeMethodId(methodId);
  console.log(`DEBUG - Normalized methodId: "${normalizedMethodId}"`);
  
  const providers = getProvidersByMethod(normalizedMethodId);
  console.log(`DEBUG - Raw providers returned:`, providers);
  
  // Map to format needed by components
  const result = providers
    .filter(provider => provider.isAvailable) // Only include available providers
    .map(provider => ({
      id: provider.id,
      name: provider.name,
      logoUrl: provider.logoUrl,
      description: provider.description,
      isRecommended: provider.isRecommended,
    }));
    
  console.log(`DEBUG - Formatted provider options:`, result);
  return result;
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
  
  // Normalize IDs before lookup
  const normalizedMethodId = normalizeMethodId(paymentMethod);
  const normalizedProviderId = normalizeMethodId(providerId);
  
  // Get the fee rate based on payment method or provider
  const feeRate = feeRates[normalizedProviderId] || feeRates[normalizedMethodId] || 0.012;
  
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
  
  // Normalize IDs before lookup
  const normalizedMethodId = normalizeMethodId(paymentMethod);
  const normalizedProviderId = normalizeMethodId(providerId);
  
  return deliveryTimes[normalizedProviderId] || deliveryTimes[normalizedMethodId] || 'Instant';
};
