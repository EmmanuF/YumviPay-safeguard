
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { createNetworkError } from '@/utils/errorHandling';

/**
 * Service to handle Kado API integration
 */
export const kadoApiService = {
  /**
   * Call the Kado API through a Supabase Edge Function
   * @param endpoint API endpoint path
   * @param method HTTP method
   * @param data Request data (for POST/PUT requests)
   * @returns Promise with the API response
   */
  callKadoApi: async (endpoint: string, method: string = 'GET', data?: any) => {
    try {
      console.log(`Calling Kado API: ${endpoint} with method ${method}`);
      
      // For simple GET endpoints like 'ping', we can use a direct GET request
      // This simplifies debugging and reduces potential points of failure
      if (method === 'GET' && (endpoint === 'ping' || endpoint === '/ping')) {
        console.log('Using direct GET request for ping endpoint');
        const { data: response, error } = await supabase.functions.invoke('kado-api', {
          method: 'GET',
          queryParams: { endpoint: 'ping' }
        });
        
        if (error) {
          console.error('Error calling Kado API via GET:', error);
          throw createNetworkError(
            `Failed to connect to Kado API: ${error.message}`,
            'server-error'
          );
        }
        
        return response;
      }
      
      // For all other endpoints, use the standard POST method
      const { data: response, error } = await supabase.functions.invoke('kado-api', {
        body: { endpoint, method, data }
      });
      
      if (error) {
        console.error('Error calling Kado API:', error);
        
        // Create specific error type for better handling
        throw createNetworkError(
          error.message || 'Failed to connect to Kado API',
          'server-error'
        );
      }
      
      if (response && response.error) {
        console.error('Error response from Kado API:', response.error);
        throw createNetworkError(
          response.message || 'Error from Kado API',
          'server-error',
          response.status
        );
      }
      
      return response;
    } catch (error) {
      console.error('Error calling Kado API:', error);
      toast({
        title: "API Error",
        description: "Could not connect to Kado API. Please try again later.",
        variant: "destructive"
      });
      throw error;
    }
  },
  
  /**
   * Check Kado API connection status
   * @returns Promise with connection status
   */
  checkApiConnection: async () => {
    try {
      console.log('Checking Kado API connection...');
      // Ping the Kado API to check if credentials are working
      const response = await kadoApiService.callKadoApi('ping', 'GET');
      console.log('Kado API connection response:', response);
      return { 
        connected: true, 
        message: 'Successfully connected to Kado API' 
      };
    } catch (error) {
      console.error('Kado API connection check failed:', error);
      const errorMessage = error instanceof Error 
        ? `Failed to connect to Kado API: ${error.message}`
        : 'Failed to connect to Kado API';
      
      return { 
        connected: false, 
        message: errorMessage
      };
    }
  },
  
  /**
   * Get available payment methods from Kado for a specific country
   * @param countryCode ISO country code
   * @returns Promise with payment methods
   */
  getPaymentMethods: async (countryCode: string) => {
    try {
      return await kadoApiService.callKadoApi(`payment-methods/${countryCode}`, 'GET');
    } catch (error) {
      console.error(`Error fetching payment methods for ${countryCode}:`, error);
      return { paymentMethods: [] };
    }
  },
  
  /**
   * Get KYC requirements for a specific country
   * @param countryCode ISO country code
   * @returns Promise with KYC requirements
   */
  getKycRequirements: async (countryCode: string) => {
    try {
      return await kadoApiService.callKadoApi(`kyc-requirements/${countryCode}`, 'GET');
    } catch (error) {
      console.error(`Error fetching KYC requirements for ${countryCode}:`, error);
      return { requirements: [] };
    }
  }
};
