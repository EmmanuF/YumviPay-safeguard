
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
      
      // Verify identity with biometrics for high-value transactions if available
      // This is an additional security measure for payment initiation
      const amount = parseFloat(params.amount);
      if (amount > 100) { // Only for transactions over $100 equivalent
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
      
      // Create a transaction object to store locally
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
      
      // Add to offline storage
      addOfflineTransaction(transaction);
      
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
      console.log(`Simulating webhook for transaction ${params.transactionId}`);
      await simulateKadoWebhook(params.transactionId);
      
      // Return - in a real app, Kado would redirect back to the returnUrl
      console.log('Kado redirect process completed');
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
  }
};
