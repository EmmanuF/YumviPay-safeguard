
import { supabase } from '@/integrations/supabase/client';

/**
 * Service to handle Kado API integration
 */
export const kadoApiService = {
  /**
   * Call Kado API through Supabase edge function
   * @param endpoint API endpoint to call
   * @param method HTTP method
   * @param data Request data
   * @returns Promise with API response
   */
  callKadoApi: async <T = any>(
    endpoint: string, 
    method: string = 'GET', 
    data?: any
  ): Promise<T> => {
    try {
      console.log(`Calling Kado API: ${endpoint} (${method})`);
      
      const { data: response, error } = await supabase.functions.invoke('kado-api', {
        body: { endpoint, method, data }
      });
      
      if (error) {
        console.error('Error calling Kado API:', error);
        throw error;
      }
      
      return response as T;
    } catch (error) {
      console.error('Error in Kado API call:', error);
      throw error;
    }
  },
  
  /**
   * Get current Kado configuration
   * @returns Promise with Kado configuration
   */
  getKadoConfig: async () => {
    try {
      const { data, error } = await supabase.functions.invoke('kado-api', {
        body: { 
          endpoint: 'config', 
          method: 'GET'
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting Kado configuration:', error);
      return { 
        widgetId: null,
        apiPublicKey: null,
        isConfigured: false
      };
    }
  },
  
  /**
   * Check if Kado API is configured
   * @returns Promise with boolean indicating if API is configured
   */
  isKadoConfigured: async (): Promise<boolean> => {
    try {
      const config = await kadoApiService.getKadoConfig();
      return config.isConfigured === true;
    } catch (error) {
      console.error('Error checking if Kado is configured:', error);
      return false;
    }
  }
};
