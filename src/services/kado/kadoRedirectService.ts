
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { deepLinkService } from '../deepLinkService';
import { isPlatform } from '@/utils/platformUtils';
import { BiometricService } from '../biometric';
import { KadoRedirectParams } from './types';
import { simulateKadoWebhook } from '../transaction';
import { kadoApiService } from './kadoApiService';

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
      
      // Get Kado configuration
      const config = await kadoApiService.getKadoConfig();
      
      if (!config.widgetId) {
        console.error('Kado Widget ID not configured');
        toast({
          title: "Configuration Error",
          description: "Kado Widget ID is not configured. Please contact support.",
          variant: "destructive"
        });
        
        // For development environment, simulate webhook
        if (process.env.NODE_ENV === 'development') {
          console.log('Development environment detected, simulating webhook response');
          await simulateKadoWebhook(params.transactionId);
        }
        
        return;
      }
      
      // Construct URL to Kado's payment widget
      const kadoUrl = new URL('https://app.kado.money');
      kadoUrl.searchParams.append('apiKey', config.widgetId);
      kadoUrl.searchParams.append('amount', params.amount);
      kadoUrl.searchParams.append('destination', encodeURIComponent(params.recipientName));
      kadoUrl.searchParams.append('destinationContact', encodeURIComponent(params.recipientContact));
      kadoUrl.searchParams.append('country', params.country);
      kadoUrl.searchParams.append('method', params.paymentMethod);
      kadoUrl.searchParams.append('orderId', params.transactionId);
      kadoUrl.searchParams.append('returnUrl', encodeURIComponent(returnUrl));
      
      if (userRef) {
        kadoUrl.searchParams.append('userRef', userRef);
      }
      
      // Log the URL being used
      console.log(`Redirecting to Kado: ${kadoUrl.toString()}`);
      
      // Show a toast indicating that we're redirecting
      toast({
        title: "Redirecting to Kado",
        description: "You will be redirected to complete KYC and payment"
      });
      
      // Handle redirection based on platform
      if (isPlatform('mobile')) {
        // Use the device's browser to open the URL on mobile
        const { Browser } = await import('@capacitor/browser');
        await Browser.open({ url: kadoUrl.toString() });
      } else {
        // Redirect in current window for web
        window.location.href = kadoUrl.toString();
      }
      
      // If we're in development mode, simulate the webhook for testing
      if (process.env.NODE_ENV === 'development') {
        // Wait a bit to simulate the user going to Kado
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Development environment detected, simulating webhook response');
        await simulateKadoWebhook(params.transactionId);
      }
      
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
