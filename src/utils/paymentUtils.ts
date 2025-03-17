
import { toast } from "@/hooks/use-toast";
import { Country } from "@/hooks/useCountries";

// Helper function for loading state
export const renderLoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="h-12 w-12 text-primary animate-spin">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
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
    if (countryCode === 'CM' && transactionData.paymentMethod === 'mobile_money' && !transactionData.selectedProvider) {
      updateTransactionData({ selectedProvider: 'mtn_momo' });
      return;
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
  const providerOptions = {
    mobile_money: {
      CM: [
        { id: 'mtn_momo', name: 'MTN Mobile Money' },
        { id: 'orange_money', name: 'Orange Money' }
      ],
      default: []
    }
  };
  
  // For Cameroon, only return mobile money options if that's the method
  if (countryCode === 'CM' && methodId === 'mobile_money') {
    return providerOptions.mobile_money.CM;
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
