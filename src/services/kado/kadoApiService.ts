
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
      
      // All requests go through POST to the edge function
      const { data: response, error } = await supabase.functions.invoke('kado-api', {
        body: { endpoint, method, data }
      });
      
      if (error) {
        console.error('Error calling Kado API:', error);
        
        // Check if it's an API keys not configured error
        if (error.message && error.message.includes('API keys not configured')) {
          throw createNetworkError(
            'Kado API keys not configured in Supabase Edge Functions', 
            'authentication-error'
          );
        }
        
        // Create specific error type for better handling
        throw createNetworkError(
          error.message || 'Failed to connect to Kado API',
          'server-error'
        );
      }
      
      if (response && response.error) {
        console.error('Error response from Kado API:', response.error);
        throw createNetworkError(
          response.error.message || 'Error from Kado API',
          'server-error',
          response.status
        );
      }
      
      // Special handling for ping endpoint to check for API key issues
      if (endpoint === 'ping' && response.ping === 'partial_success') {
        console.warn('Partial success from ping endpoint:', response);
        // Still return the response but with a warning about the partial success
        console.log('Edge function running but could not connect to Kado API');
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
      
      // First check if API keys are configured
      const { data: secretsData, error: secretsError } = await supabase.functions.invoke('kado-api', {
        body: { endpoint: 'check-secrets' }
      });
      
      if (secretsError) {
        console.error('Error checking API keys:', secretsError);
        return { 
          connected: false, 
          message: `Failed to check API keys: ${secretsError.message}`
        };
      }
      
      const publicKeyConfigured = secretsData?.publicKeyConfigured || false;
      const privateKeyConfigured = secretsData?.privateKeyConfigured || false;
      
      if (!publicKeyConfigured || !privateKeyConfigured) {
        return { 
          connected: false, 
          message: 'Kado API keys not configured in Supabase Edge Functions'
        };
      }
      
      // Ping the Kado API to check if credentials are working
      const response = await kadoApiService.callKadoApi('ping', 'GET');
      console.log('Kado API connection response:', response);
      
      // Handle partial success from ping
      if (response.ping === 'partial_success') {
        return {
          connected: true,
          message: 'Edge function running but could not connect to Kado API: ' + response.message
        };
      }
      
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
