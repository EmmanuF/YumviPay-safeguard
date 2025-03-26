
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { kadoRedirectService } from '../redirect';
import { KadoRedirectParams } from '../types';
import { isPlatform } from '@/utils/platformUtils';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { updateTransactionStatus } from '@/services/transaction';

/**
 * Hook to handle Kado redirection functionality
 */
export const useKadoRedirect = (checkApiConnection: (forceCheck?: boolean) => Promise<any>) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
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
      let isConnected = false;
      
      try {
        const { connected } = await checkApiConnection();
        isConnected = connected;
      } catch (connectionError) {
        console.error('Error checking API connection:', connectionError);
      }
      
      if (!isConnected) {
        console.warn('API connection check failed before redirect, proceeding with fallback flow');
        
        // Use shadcn toast with correct API
        toast({
          variant: "warning",
          description: "Could not connect to payment provider API. Proceeding with offline mode."
        });
        
        // Also use sonner toast for better visibility
        sonnerToast.warning("API Connection Issue", {
          description: "Proceeding in offline mode. Your transaction will still be processed.",
        });
        
        // Continue with the redirect despite the API connection issue
        // This is our fallback for when the Kado API is unreachable
      }
      
      console.log('Redirecting to Kado with params:', { ...params, returnUrl, userRef });
      
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
      
      // Use shadcn toast with correct API
      toast({
        variant: "destructive",
        description: "Failed to connect to payment provider. Please try again."
      });
      
      // Create a fallback transaction in case of error to prevent UI from being stuck
      try {
        const transaction = {
          id: params.transactionId,
          amount: params.amount,
          recipientName: params.recipientName,
          recipientContact: params.recipientContact || '',
          country: params.country,
          paymentMethod: params.paymentMethod,
          provider: params.paymentMethod === 'mobile_money' ? 'MTN Mobile Money' : 'Bank Transfer',
          status: 'failed' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
          estimatedDelivery: 'Failed',
          failureReason: error instanceof Error ? error.message : 'Unknown error during Kado redirect',
          totalAmount: params.amount
        };
        
        // Store locally for retrieval
        localStorage.setItem(`transaction_${params.transactionId}`, JSON.stringify(transaction));
        
        // Import and use updateTransactionStatus to ensure it's properly recorded
        await updateTransactionStatus(params.transactionId, 'failed', {
          failureReason: error instanceof Error ? error.message : 'Unknown error during Kado redirect'
        });
        
        // Navigate to transaction page to show the error
        navigate(`/transaction/${params.transactionId}`);
      } catch (fallbackError) {
        console.error('Error creating fallback transaction:', fallbackError);
        
        // As a last resort, just navigate to the transaction page and let it handle the error
        navigate(`/transaction/${params.transactionId}`);
      }
      
      throw error; // Re-throw the error to be handled by the caller
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    redirectToKadoAndReturn
  };
};
