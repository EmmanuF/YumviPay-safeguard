
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { createNetworkError, handleNetworkError } from '@/utils/errorHandling';

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
        console.log('Error details:', JSON.stringify(error, null, 2));
        
        // Check if it's an API keys not configured error
        if (error.message && error.message.includes('API keys not configured')) {
          throw createNetworkError(
            'Kado API keys not configured in Supabase Edge Functions', 
            'authentication-error'
          );
        }
        
        // Check for timeout errors
        if (error.message && error.message.includes('AbortError')) {
          throw createNetworkError(
            'Connection to Kado API timed out. Please try again later.',
            'timeout-error'
          );
        }
        
        // Create specific error type for better handling
        throw createNetworkError(
          error.message || 'Failed to connect to Kado API',
          'server-error'
        );
      }
      
      // Check if response contains an error
      if (response && response.error) {
        console.error('Error response from Kado API:', response.error);
        throw createNetworkError(
          response.error.message || 'Error from Kado API',
          'server-error',
          response.status
        );
      }
      
      // Special handling for ping endpoint to check for API key issues
      if (endpoint === 'ping' && response && response.ping === 'partial_success') {
        console.warn('Partial success from ping endpoint:', response);
        // Still return the response but with a warning about the partial success
        console.log('Edge function running but could not connect to Kado API');
      }
      
      return response;
    } catch (error) {
      console.error('Error calling Kado API:', error);
      
      // Don't show toast here - let the calling function decide how to handle the error
      // This allows for more targeted error handling in different contexts
      
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
          message: `Failed to check API keys: ${secretsError.message}`,
          error: secretsError
        };
      }
      
      const publicKeyConfigured = secretsData?.publicKeyConfigured || false;
      const privateKeyConfigured = secretsData?.privateKeyConfigured || false;
      
      if (!publicKeyConfigured || !privateKeyConfigured) {
        const missingKeys = [];
        if (!publicKeyConfigured) missingKeys.push('KADO_API_PUBLIC_KEY');
        if (!privateKeyConfigured) missingKeys.push('KADO_API_PRIVATE_KEY');
        
        return { 
          connected: false, 
          message: `Kado API keys not configured in Supabase Edge Functions: Missing ${missingKeys.join(', ')}`
        };
      }
      
      // Ping the Kado API to check if credentials are working
      const response = await kadoApiService.callKadoApi('ping', 'GET');
      console.log('Kado API connection response:', response);
      
      // Handle different ping responses
      if (!response) {
        return {
          connected: false,
          message: 'Empty response from Kado API ping'
        };
      }
      
      // Handle partial success from ping
      if (response.ping === 'partial_success') {
        return {
          connected: true,
          message: `Edge function running but could not connect to Kado API: ${response.message || 'Unknown error'}`
        };
      }
      
      // Handle successful ping
      return { 
        connected: true, 
        message: 'Successfully connected to Kado API' 
      };
    } catch (error) {
      console.error('Kado API connection check failed:', error);
      
      // Format error message based on the error type
      let errorMessage = 'Failed to connect to Kado API';
      
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
        
        // Add more context for edge function errors
        if (error.message.includes('Edge Function returned a non-2xx status code')) {
          errorMessage = 'Failed to connect to Kado API: Edge Function returned a non-2xx status code. Please check the Edge Function logs.';
        }
      }
      
      return { 
        connected: false, 
        message: errorMessage,
        error
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
