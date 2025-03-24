import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { kadoRedirectService } from './kadoRedirectService';
import { kadoWebhookService } from './kadoWebhookService';
import { kadoKycService } from './kadoKycService';
import { kadoApiService } from './kadoApiService';
import { KadoRedirectParams } from './types';
import { supabase } from '@/integrations/supabase/client';
import { isPlatform } from '@/utils/platformUtils';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

/**
 * Hook to use Kado services with navigation
 */
export const useKado = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionCheckInProgress, setConnectionCheckInProgress] = useState(false);
  
  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (connectionCheckInProgress) return;
      
      try {
        setConnectionCheckInProgress(true);
        console.log('Checking Kado API connection on mount...');
        const { connected } = await kadoApiService.checkApiConnection();
        console.log('Kado API connection check result:', connected);
        setIsApiConnected(connected);
      } catch (error) {
        console.error('Failed to check Kado API connection:', error);
        setIsApiConnected(false);
      } finally {
        setConnectionCheckInProgress(false);
      }
    };
    
    checkConnection();
  }, []);
  
  /**
   * Check API connection with better error handling
   */
  const checkApiConnection = useCallback(async () => {
    if (connectionCheckInProgress) {
      console.log('Connection check already in progress, waiting...');
      // Wait for the ongoing check to complete
      await new Promise(resolve => {
        const interval = setInterval(() => {
          if (!connectionCheckInProgress) {
            clearInterval(interval);
            resolve(null);
          }
        }, 100);
      });
      
      // Return the current connection state if we already know it
      if (isApiConnected !== null) {
        return { 
          connected: isApiConnected, 
          message: isApiConnected ? 'Connected to Kado API' : 'Not connected to Kado API' 
        };
      }
    }
    
    try {
      setConnectionCheckInProgress(true);
      console.log('Checking Kado API connection...');
      
      // Try to ping the Kado API
      const response = await kadoApiService.checkApiConnection();
      setIsApiConnected(response.connected);
      
      console.log('Kado API connection check result:', response.connected);
      return response;
    } catch (error) {
      console.error('Failed to check Kado API connection:', error);
      setIsApiConnected(false);
      return { 
        connected: false, 
        message: 'Failed to connect to Kado API: ' + (error instanceof Error ? error.message : String(error))
      };
    } finally {
      setConnectionCheckInProgress(false);
    }
  }, [connectionCheckInProgress, isApiConnected]);
  
  /**
   * Redirect to Kado for payment and return to transaction status page
   * @param params Redirect parameters without returnUrl
   */
  const redirectToKadoAndReturn = async (params: Omit<KadoRedirectParams, 'returnUrl'>) => {
    setIsLoading(true);
    
    try {
      // Get current authenticated user ID to use as userRef
      const { data: { session } } = await supabase.auth.getSession();
      const userRef = session?.user?.id;
      
      // Determine if we should use deep linking
      const useDeepLink = isPlatform('mobile');
      
      // Construct the return URL to the transaction status page
      const returnUrl = `${window.location.origin}/transaction/${params.transactionId}`;
      
      // Check if API is connected before proceeding
      console.log('Checking API connection before redirect...');
      const { connected } = await checkApiConnection();
      
      if (!connected) {
        console.error('API connection check failed before redirect');
        toast({
          title: "API Connection Error",
          description: "Could not connect to payment provider API. Please try again later.",
          variant: "destructive"
        });
        
        // Also use sonner toast for better visibility
        toast.error("API Error", {
          description: "Could not connect to Kado API. Please try again later.",
        });
        
        throw new Error("Could not connect to Kado API");
      }
      
      console.log('API connection successful, redirecting to Kado with params:', { ...params, returnUrl, userRef });
      
      // Redirect to Kado
      await kadoRedirectService.redirectToKado({
        ...params,
        returnUrl,
        userRef,
        deepLinkBack: useDeepLink
      });
      
      // Navigate to the transaction status page
      navigate(`/transaction/${params.transactionId}`);
    } catch (error) {
      console.error('Error redirecting to Kado:', error);
      toast({
        title: "Redirect Error",
        description: "Failed to connect to payment provider. Please try again.",
        variant: "destructive"
      });
      
      // Also use sonner toast for better visibility
      toast.error("API Error", {
        description: "Could not connect to Kado API. Please try again later.",
      });
      
      throw error; // Re-throw the error to be handled by the caller
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Check KYC status for current user
   */
  const checkCurrentUserKycStatus = async () => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.log('No authenticated user to check KYC status');
        return null;
      }
      
      // Check KYC status for current user
      return await kadoKycService.checkKycStatus(session.user.id);
    } catch (error) {
      console.error('Error checking current user KYC status:', error);
      return null;
    }
  };
  
  /**
   * Request KYC verification for current user
   */
  const requestCurrentUserKycVerification = async () => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.log('No authenticated user to request KYC verification');
        return {
          success: false,
          message: 'No authenticated user found'
        };
      }
      
      // Request KYC verification
      return await kadoKycService.requestKycVerification(session.user.id);
    } catch (error) {
      console.error('Error requesting KYC verification:', error);
      return {
        success: false,
        message: 'Error requesting KYC verification'
      };
    }
  };
  
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
      return [];
    }
  };
  
  return {
    isApiConnected,
    isLoading,
    checkApiConnection,
    ...kadoRedirectService,
    ...kadoWebhookService,
    ...kadoKycService,
    ...kadoApiService,
    redirectToKadoAndReturn,
    checkCurrentUserKycStatus,
    requestCurrentUserKycVerification,
    getCountryPaymentMethods
  };
};
