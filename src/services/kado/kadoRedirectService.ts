
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { deepLinkService } from '../deepLinkService';
import { isPlatform } from '@/utils/platformUtils';
import { BiometricService } from '../biometric';
import { KadoRedirectParams } from './types';
import { simulateKadoWebhook } from '../transaction';
import { addOfflineTransaction } from '../transaction/transactionStore';

/**
 * Service to handle redirecting to Kado for KYC and payment processing
 */
export const kadoRedirectService = {
  /**
   * Redirect to Kado for KYC and payment processing
   * @param params Redirect parameters
   * @returns Promise that resolves when redirected
   */
  redirectToKado: async (params: KadoRedirectParams): Promise<void> => {
    try {
      console.log('kadoRedirectService.redirectToKado called with params:', params);
      
      // Get user ID if authenticated to use as userRef
      const { data: { session } } = await supabase.auth.getSession();
      let userRef = params.userRef;
      
      // If no userRef was provided but user is logged in, use their ID
      if (!userRef && session?.user?.id) {
        userRef = session.user.id;
        console.log(`Using authenticated user ID as userRef: ${userRef}`);
      }
      
      // Create a transaction object to store locally immediately
      const transaction = {
        id: params.transactionId,
        amount: params.amount,
        recipientName: params.recipientName,
        recipientContact: params.recipientContact,
        country: params.country,
        paymentMethod: params.paymentMethod,
        provider: params.paymentMethod === 'mobile_money' ? 'MTN Mobile Money' : 'Bank Transfer',
        status: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedDelivery: 'Processing',
        totalAmount: params.amount
      };
      
      // Add to offline storage immediately for reliability
      console.log('Adding transaction to offline storage:', transaction);
      addOfflineTransaction(transaction);
      
      // Also store in localStorage for redundancy
      localStorage.setItem(`transaction_${params.transactionId}`, JSON.stringify({
        ...transaction,
        transactionId: params.transactionId,
      }));
      
      // Verify identity with biometrics for high-value transactions if available
      // This is an additional security measure for payment initiation
      const amount = parseFloat(params.amount);
      if (amount > 100) { // Only for transactions over $100 equivalent
        try {
          const isAvailable = await BiometricService.isAvailable();
          const isEnabled = await BiometricService.isEnabled();
          
          if (isAvailable && isEnabled) {
            const authenticated = await BiometricService.authenticate();
            if (!authenticated) {
              toast({
                title: "Authentication Required",
                description: "Biometric verification failed. Please try again.",
                variant: "destructive"
              });
              return;
            }
          }
        } catch (bioError) {
          console.error('Biometric authentication error:', bioError);
          // Continue without biometric auth if there's an error
        }
      }
      
      // Generate appropriate return URL based on platform
      let returnUrl: string;
      
      if (isPlatform('mobile') && params.deepLinkBack) {
        // Generate a deep link for native apps
        returnUrl = deepLinkService.generateDeepLink(
          `transaction/${params.transactionId}`,
          { source: 'kado', userRef: userRef || 'guest' }
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
        title: "Redirecting to Payment Provider",
        description: "You will be redirected to complete KYC and payment"
      });
      
      // Simulate a very short delay for redirection (250ms instead of 1000ms)
      await new Promise(resolve => setTimeout(resolve, 250));
      
      // Simulate the Kado webhook response immediately without waiting
      console.log(`Simulating webhook for transaction ${params.transactionId}`);
      
      // Use a try/catch but don't wait for it to complete - let it run in background
      try {
        // Don't await this - let it run in the background with a deliberately detached promise
        simulateKadoWebhook(params.transactionId).catch(webhookError => {
          console.error('Background webhook simulation error:', webhookError);
        });
      } catch (webhookError) {
        console.error('Error setting up webhook simulation:', webhookError);
      }
      
      console.log('Kado redirect process completed successfully');
      return;
    } catch (error) {
      console.error('Error redirecting to Kado:', error);
      toast({
        title: "Error",
        description: "Could not redirect to payment provider. Please try again.",
        variant: "destructive"
      });
      
      // Create a fallback transaction in case of error so we don't get stuck
      if (params.transactionId) {
        try {
          const { updateTransactionStatus } = await import('../transaction/transactionUpdate');
          await updateTransactionStatus(params.transactionId, 'failed', {
            failureReason: error instanceof Error ? error.message : 'Unknown error during Kado redirect'
          });
        } catch (updateError) {
          console.error('Error updating transaction status after redirect error:', updateError);
          
          // Last resort - direct localStorage update
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
              failureReason: error instanceof Error ? error.message : 'Unknown error during Kado redirect',
              estimatedDelivery: 'Failed',
              totalAmount: params.amount
            };
            
            localStorage.setItem(`transaction_${params.transactionId}`, JSON.stringify(transaction));
            console.log(`Emergency fallback: stored failed transaction in localStorage for ${params.transactionId}`);
          } catch (storageError) {
            console.error('Failed emergency localStorage fallback:', storageError);
          }
        }
      }
      
      throw error;
    }
  }
};
