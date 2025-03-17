
import { Transaction } from '@/types/transaction';
import { simulateKadoWebhook, getTransactionById } from '@/services/transactions';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { deepLinkService } from './deepLinkService';
import { isPlatform } from '@/utils/platformUtils';
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface for Kado redirect params
 */
export interface KadoRedirectParams {
  amount: string;
  recipientName: string;
  recipientContact: string;
  country: string;
  paymentMethod: string;
  transactionId: string;
  returnUrl: string;
  userRef?: string; // Added userRef param for KYC tracking
}

/**
 * Interface for Kado webhook response
 */
export interface KadoWebhookResponse {
  status: 'success' | 'failure';
  transactionId: string;
  kadoTransactionId: string;
  timestamp: string;
  message?: string;
  failureReason?: string;
  userRef?: string; // Added userRef field to track the user
}

/**
 * Interface for KYC status response from Kado API
 */
export interface KadoKycStatusResponse {
  status: 'verified' | 'pending' | 'rejected' | 'not_started';
  timestamp: string;
  details?: {
    rejectionReason?: string;
    completedSteps?: string[];
    remainingSteps?: string[];
  };
}

/**
 * Service to handle Kado integration
 */
export const kadoService = {
  /**
   * Redirect to Kado for KYC and payment processing
   * @param params Redirect parameters
   * @returns Promise that resolves when redirected
   */
  redirectToKado: async (params: KadoRedirectParams): Promise<void> => {
    try {
      // Get user ID if authenticated to use as userRef
      const { data: { session } } = await supabase.auth.getSession();
      let userRef = params.userRef;
      
      // If no userRef was provided but user is logged in, use their ID
      if (!userRef && session?.user?.id) {
        userRef = session.user.id;
        console.log(`Using authenticated user ID as userRef: ${userRef}`);
      }
      
      // Generate appropriate return URL based on platform
      let returnUrl: string;
      
      if (isPlatform('mobile')) {
        // Generate a deep link for native apps
        returnUrl = deepLinkService.generateDeepLink(
          `transaction/${params.transactionId}`,
          { source: 'kado', userRef }
        );
      } else {
        // Use web URL format for browser
        returnUrl = params.returnUrl || `${window.location.origin}/transaction/${params.transactionId}`;
      }
      
      // In a real app, this would construct a URL to Kado's payment page
      // Include userRef parameter for KYC tracking
      const kadoUrl = `https://kado.com/pay?amount=${params.amount}&recipient=${encodeURIComponent(params.recipientName)}&country=${params.country}&payment_method=${params.paymentMethod}&transaction_id=${params.transactionId}&return_url=${encodeURIComponent(returnUrl)}&user_ref=${userRef || 'guest'}`;
      
      // For simulation purposes, we'll just log the URL
      console.log(`Redirecting to Kado: ${kadoUrl}`);
      console.log(`Return URL: ${returnUrl}`);
      console.log(`User reference: ${userRef || 'guest'}`);
      
      // Show a toast indicating that we're redirecting
      toast({
        title: "Redirecting to Kado",
        description: "You will be redirected to complete KYC and payment"
      });
      
      // Simulate a delay to represent the user going to Kado and completing the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate the Kado webhook response
      await simulateKadoWebhook(params.transactionId);
      
      // Return - in a real app, Kado would redirect back to the returnUrl
      return;
    } catch (error) {
      console.error('Error redirecting to Kado:', error);
      toast({
        title: "Error",
        description: "Could not redirect to payment provider",
        variant: "destructive"
      });
      throw error;
    }
  },
  
  /**
   * Handle webhook received from Kado
   * @param response Webhook response data
   * @returns Updated transaction
   */
  handleWebhook: async (response: KadoWebhookResponse): Promise<Transaction | null> => {
    console.log('Received webhook from Kado:', response);
    
    // Get the transaction
    const transaction = await getTransactionById(response.transactionId);
    
    if (!transaction) {
      console.error('Transaction not found:', response.transactionId);
      return null;
    }
    
    // If a userRef was included in the webhook, we should store it with the transaction
    if (response.userRef) {
      // In a real implementation, this would update the transaction in the database
      console.log(`Webhook includes userRef: ${response.userRef}`);
      
      // This would track the KYC status for this user
      // Example: await updateUserKycStatus(response.userRef, response.status);
    }
    
    // In a real app, this would update the transaction status in your database
    // For now, we'll just return the transaction
    return transaction;
  },
  
  /**
   * Check KYC status for a user from Kado API
   * This requires API keys which will be added later
   * 
   * @param userRef User reference ID (could be your internal user ID)
   * @returns Promise that resolves to KYC status
   */
  checkKycStatus: async (userRef: string): Promise<KadoKycStatusResponse> => {
    // This is a placeholder implementation until API keys are available
    console.log(`Checking KYC status for user: ${userRef}`);
    
    // In a real implementation, this would call the Kado API endpoint:
    // GET https://api.kado.money/v1/users/:userRef/kyc
    // With appropriate authentication headers
    
    // For now, return a simulated response
    const statuses: Array<'verified' | 'pending' | 'rejected' | 'not_started'> = [
      'verified',
      'pending',
      'rejected',
      'not_started'
    ];
    
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      status: randomStatus,
      timestamp: new Date().toISOString(),
      details: randomStatus === 'rejected' 
        ? { rejectionReason: 'This is a simulated rejection reason' }
        : randomStatus === 'pending' 
          ? { completedSteps: ['basic_info', 'id_upload'], remainingSteps: ['address_verification'] }
          : undefined
    };
  },
  
  /**
   * Prepare for real API integration with Kado
   * This function will be implemented when API keys are available
   */
  prepareKadoApiConfig: () => {
    console.log('Kado API integration will be configured when API keys are available');
    
    // This function will store and configure the API keys when available
    // API base URL: https://api.kado.money/v1/
    
    // When ready, uncomment and use the following Supabase edge function format:
    /*
    const invokeKadoApi = async (endpoint: string, method: string = 'GET', data?: any) => {
      try {
        const { data: response, error } = await supabase.functions.invoke('kado-api', {
          body: { endpoint, method, data }
        });
        
        if (error) throw error;
        return response;
      } catch (error) {
        console.error('Error calling Kado API:', error);
        throw error;
      }
    };
    */
  }
};

/**
 * Hook to use Kado service with navigation
 */
export const useKado = () => {
  const navigate = useNavigate();
  
  /**
   * Redirect to Kado for payment and return to transaction status page
   * @param params Redirect parameters without returnUrl
   */
  const redirectToKadoAndReturn = async (params: Omit<KadoRedirectParams, 'returnUrl'>) => {
    // Get current authenticated user ID to use as userRef
    const { data: { session } } = await supabase.auth.getSession();
    const userRef = session?.user?.id;
    
    // Construct the return URL to the transaction status page
    const returnUrl = `${window.location.origin}/transaction/${params.transactionId}`;
    
    // Redirect to Kado
    await kadoService.redirectToKado({
      ...params,
      returnUrl,
      userRef
    });
    
    // Navigate to the transaction status page
    navigate(`/transaction/${params.transactionId}`);
  };
  
  /**
   * Check KYC status for current user
   */
  const checkCurrentUserKycStatus = async (): Promise<KadoKycStatusResponse | null> => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.log('No authenticated user to check KYC status');
        return null;
      }
      
      // Check KYC status for current user
      return await kadoService.checkKycStatus(session.user.id);
    } catch (error) {
      console.error('Error checking current user KYC status:', error);
      return null;
    }
  };
  
  return {
    ...kadoService,
    redirectToKadoAndReturn,
    checkCurrentUserKycStatus
  };
};
