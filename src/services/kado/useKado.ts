
/**
 * Hook for Kado payment service integration
 */

import { useState, useCallback } from 'react';
import { kadoRedirectService } from './redirect';

interface KadoRedirectParams {
  amount: string;
  recipientName: string;
  recipientContact: string;
  country: string;
  paymentMethod: string;
  transactionId: string;
  returnUrl?: string;
}

interface KadoConnectionResult {
  connected: boolean;
  message: string;
}

export const useKado = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Redirects to Kado for payment processing and returns to specified URL
   */
  const redirectToKadoAndReturn = useCallback(async (params: KadoRedirectParams): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Initiating Kado redirect with params:', params);
      await kadoRedirectService.redirectToKado(params);
    } catch (err) {
      console.error('❌ Error in redirectToKadoAndReturn:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      throw err;
    } finally {
      // Note: may not execute if redirect happens successfully
      setIsLoading(false);
    }
  }, []);

  /**
   * Checks connection to Kado API
   * In a real implementation, this would make an actual API call
   */
  const checkApiConnection = useCallback(async (): Promise<KadoConnectionResult> => {
    setIsLoading(true);
    
    try {
      console.log('🔍 Checking Kado API connection');
      
      // Simulate API check - in real implementation would use fetch to test connection
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);
      return {
        connected: true,
        message: 'Connected to Kado API successfully'
      };
    } catch (err) {
      console.error('❌ Error checking Kado API connection:', err);
      setIsLoading(false);
      return {
        connected: false,
        message: err instanceof Error ? err.message : 'Failed to connect to Kado API'
      };
    }
  }, []);

  /**
   * Fetch payment methods available for a specific country
   */
  const getCountryPaymentMethods = useCallback(async (countryCode: string) => {
    try {
      console.log(`🔍 Fetching payment methods for ${countryCode}`);
      
      // For Cameroon, return hard-coded payment methods
      if (countryCode === 'CM') {
        return [
          {
            id: 'mobile_money',
            name: 'Mobile Money',
            description: 'Send via mobile money providers',
            icon: 'smartphone',
            providers: ['MTN Mobile Money', 'Orange Money']
          },
          {
            id: 'bank_transfer',
            name: 'Bank Transfer',
            description: 'Send via bank transfer',
            icon: 'building',
            providers: ['Afriland First Bank', 'Ecobank']
          }
        ];
      }
      
      // For other countries, return empty array for now
      return [];
    } catch (error) {
      console.error(`❌ Error fetching payment methods for ${countryCode}:`, error);
      return [];
    }
  }, []);

  return {
    redirectToKadoAndReturn,
    checkApiConnection,
    getCountryPaymentMethods,
    isLoading,
    error
  };
};
