
import { kadoApiService } from '../kadoApiService';

/**
 * Hook for managing payment methods in Kado
 */
export const useKadoPaymentMethods = () => {
  /**
   * Get payment methods available for a specific country
   * @param countryCode ISO country code
   */
  const getCountryPaymentMethods = async (countryCode: string) => {
    if (!countryCode) {
      console.error('Country code is required to get payment methods');
      return [];
    }
    
    try {
      const result = await kadoApiService.getPaymentMethods(countryCode);
      return result.paymentMethods || [];
    } catch (error) {
      console.error(`Error fetching payment methods for ${countryCode}:`, error);
      
      // Return fallback data for Cameroon when the API fails
      if (countryCode.toUpperCase() === 'CM') {
        return [
          { id: 'mobile_money', name: 'Mobile Money', providers: ['MTN Mobile Money', 'Orange Money'] },
          { id: 'bank_transfer', name: 'Bank Transfer', providers: ['Afriland First Bank', 'Ecobank'] }
        ];
      }
      
      return [];
    }
  };
  
  return {
    getCountryPaymentMethods
  };
};
