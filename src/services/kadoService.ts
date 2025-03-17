
import { Transaction } from '@/types/transaction';
import { simulateKadoWebhook, getTransactionById } from '@/services/transactions';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { deepLinkService } from './deepLinkService';
import { isPlatform } from '@/utils/platformUtils';

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
    // Generate appropriate return URL based on platform
    let returnUrl: string;
    
    if (isPlatform('mobile')) {
      // Generate a deep link for native apps
      returnUrl = deepLinkService.generateDeepLink(
        `transaction/${params.transactionId}`,
        { source: 'kado' }
      );
    } else {
      // Use web URL format for browser
      returnUrl = params.returnUrl || `${window.location.origin}/transaction/${params.transactionId}`;
    }
    
    // In a real app, this would construct a URL to Kado's payment page
    const kadoUrl = `https://kado.com/pay?amount=${params.amount}&recipient=${encodeURIComponent(params.recipientName)}&country=${params.country}&payment_method=${params.paymentMethod}&transaction_id=${params.transactionId}&return_url=${encodeURIComponent(returnUrl)}`;
    
    // For simulation purposes, we'll just log the URL
    console.log(`Redirecting to Kado: ${kadoUrl}`);
    console.log(`Return URL: ${returnUrl}`);
    
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
  },
  
  /**
   * Handle webhook received from Kado
   * @param response Webhook response data
   * @returns Updated transaction
   */
  handleWebhook: async (response: KadoWebhookResponse): Promise<Transaction | null> => {
    console.log('Received webhook from Kado:', response);
    
    // Get the transaction
    const transaction = getTransactionById(response.transactionId);
    
    if (!transaction) {
      console.error('Transaction not found:', response.transactionId);
      return null;
    }
    
    // In a real app, this would update the transaction status in your database
    // For now, we'll just return the transaction
    return transaction;
  },
  
  /**
   * Check KYC status for a user
   * @param userId User ID
   * @returns Promise that resolves to KYC status
   */
  checkKycStatus: async (userId: string): Promise<'verified' | 'pending' | 'rejected' | 'not_started'> => {
    // In a real app, this would call Kado's API to check the user's KYC status
    
    // For simulation purposes, return a random status
    const statuses: Array<'verified' | 'pending' | 'rejected' | 'not_started'> = [
      'verified',
      'pending',
      'rejected',
      'not_started'
    ];
    
    return statuses[Math.floor(Math.random() * statuses.length)];
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
    // Construct the return URL to the transaction status page
    const returnUrl = `${window.location.origin}/transaction/${params.transactionId}`;
    
    // Redirect to Kado
    await kadoService.redirectToKado({
      ...params,
      returnUrl
    });
    
    // Navigate to the transaction status page
    navigate(`/transaction/${params.transactionId}`);
  };
  
  return {
    ...kadoService,
    redirectToKadoAndReturn
  };
};
