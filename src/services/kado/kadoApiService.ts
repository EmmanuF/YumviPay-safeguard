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
      console.log('Request data:', data ? JSON.stringify(data, null, 2) : 'No data');
      
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
            'authentication-error',
            undefined,
            undefined,
            { originalError: error }
          );
        }
        
        // Check for timeout errors
        if (error.message && error.message.includes('AbortError')) {
          throw createNetworkError(
            'Connection to Kado API timed out. Please try again later.',
            'timeout-error',
            undefined,
            undefined,
            { originalError: error }
          );
        }
        
        // Create specific error type for better handling
        throw createNetworkError(
          error.message || 'Failed to connect to Kado API',
          'server-error',
          undefined,
          undefined,
          { originalError: error }
        );
      }
      
      console.log('Kado API response:', JSON.stringify(response, null, 2));
      
      // Check if response contains an error from our Edge Function
      if (response && response.error) {
        console.error('Error response from Edge Function:', response.error);
        throw createNetworkError(
          response.error.message || 'Error from Kado API',
          'server-error',
          undefined,
          undefined,
          response.error
        );
      }
      
      // Special handling for ping endpoint
      if (endpoint === 'ping') {
        console.log('Ping response:', response);
        
        if (response && response.ping === 'error') {
          throw createNetworkError(
            response.message || 'Error from ping endpoint',
            'server-error',
            undefined,
            undefined,
            response
          );
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error calling Kado API:', error);
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
      
      console.log('API keys check response:', secretsData);
      
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
      
      try {
        // Run diagnostics before pinging to get detailed insights
        console.log('Running diagnostics before ping...');
        const { data: diagnosticData, error: diagnosticError } = await supabase.functions.invoke('kado-api', {
          body: { endpoint: 'diagnostics' }
        });
        
        if (diagnosticError) {
          console.error('Diagnostics error:', diagnosticError);
        } else {
          console.log('Diagnostics results:', diagnosticData);
          
          // If diagnostics show network issues, return detailed information
          if (diagnosticData && !diagnosticData.networkTest?.success) {
            return {
              connected: false,
              message: `Cannot connect to Kado API: ${diagnosticData.networkTest?.error || diagnosticData.networkTest?.statusText || 'Network test failed'}`,
              diagnostics: diagnosticData
            };
          }
          
          // If diagnostics show HMAC issues, return detailed information
          if (diagnosticData && !diagnosticData.hmacTest?.success) {
            return {
              connected: false,
              message: `HMAC signature generation failed: ${diagnosticData.hmacTest?.error || 'Unknown HMAC error'}`,
              diagnostics: diagnosticData
            };
          }
          
          // If diagnostics show direct domain accessibility but ping fails, 
          // it's likely the specific ping endpoint doesn't exist
          if (diagnosticData && diagnosticData.domainPingTest?.success && !diagnosticData.fullPingTest?.success) {
            if (diagnosticData.fullPingTest?.status === 404) {
              // If we can reach the domain but the ping endpoint returns 404, consider it a success
              // This means the API is up but doesn't have a ping endpoint
              console.log('API domain is reachable but ping endpoint returns 404, considering it a partial success');
              return {
                connected: true,
                message: 'Successfully connected to Kado API server (the /ping endpoint doesn\'t exist but the server is responding)',
                partialSuccess: true,
                diagnostics: diagnosticData
              };
            }
          }
          
          // If we have exploratory tests with successful endpoints, use that as an indicator of success
          if (diagnosticData?.exploratoryTests) {
            const successfulEndpoints = diagnosticData.exploratoryTests.filter(test => test.success);
            if (successfulEndpoints.length > 0) {
              const endpointsList = successfulEndpoints.map(e => e.endpoint).join(', ');
              console.log(`Found ${successfulEndpoints.length} working alternative endpoints: ${endpointsList}`);
              return {
                connected: true,
                message: `Successfully connected to Kado API using alternative endpoints (${endpointsList})`,
                partialSuccess: true,
                diagnostics: diagnosticData
              };
            }
          }
        }
      } catch (diagError) {
        console.error('Error running diagnostics:', diagError);
      }
      
      // Ping the Kado API to check if credentials are working
      console.log('Pinging Kado API...');
      const response = await kadoApiService.callKadoApi('ping', 'GET');
      console.log('Kado API connection response:', response);
      
      // Check for simulated response (when ping endpoint returns 404)
      if (response?.simulatedResponse) {
        console.log('Received simulated ping response:', response);
        return {
          connected: true,
          message: response.message || 'Connected to Kado API server (simulated response)',
          partialSuccess: true,
          responseData: response
        };
      }
      
      // Handle different ping responses
      if (!response) {
        return {
          connected: false,
          message: 'Empty response from Kado API ping'
        };
      }
      
      // If we have response.status, use it to determine connection success
      if (response.status) {
        const isSuccess = response.status >= 200 && response.status < 300;
        return {
          connected: isSuccess,
          message: isSuccess 
            ? (response.message || 'Successfully connected to Kado API')
            : `Failed to connect to Kado API: ${response.statusText || response.message || `Status code ${response.status}`}`,
          statusCode: response.status,
          responseData: response
        };
      }
      
      // Handle ping response format
      if (response.ping === 'success') {
        return { 
          connected: true, 
          message: response.message || 'Successfully connected to Kado API',
          responseData: response
        };
      } else if (response.ping === 'error') {
        return {
          connected: false,
          message: response.message || 'Error connecting to Kado API',
          error: response.error,
          responseData: response
        };
      }
      
      // Handle successful ping
      return { 
        connected: true, 
        message: response.message || 'Successfully connected to Kado API',
        responseData: response
      };
    } catch (error) {
      console.error('Kado API connection check failed:', error);
      
      // Format error message based on the error type
      let errorMessage = 'Failed to connect to Kado API';
      
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
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
      console.log(`Fetching payment methods for ${countryCode}...`);
      const response = await kadoApiService.callKadoApi(`payment-methods/${countryCode}`, 'GET');
      console.log(`Payment methods response:`, response);
      return response;
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
      console.log(`Fetching KYC requirements for ${countryCode}...`);
      const response = await kadoApiService.callKadoApi(`kyc-requirements/${countryCode}`, 'GET');
      console.log(`KYC requirements response:`, response);
      return response;
    } catch (error) {
      console.error(`Error fetching KYC requirements for ${countryCode}:`, error);
      return { requirements: [] };
    }
  },
  
  /**
   * Run detailed diagnostics on the Kado API connection
   * @returns Promise with diagnostic results
   */
  runDiagnostics: async () => {
    try {
      console.log('Running detailed Kado API diagnostics...');
      
      const { data, error } = await supabase.functions.invoke('kado-api', {
        body: { endpoint: 'diagnostics' }
      });
      
      if (error) {
        console.error('Diagnostics error:', error);
        throw error;
      }
      
      console.log('Diagnostics completed:', data);
      return data;
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
      throw error;
    }
  }
};
