
/**
 * Kado redirect service for payment processing
 */

import { navigate } from '@/utils/navigationUtils';
import { createFallbackTransaction } from '@/services/transaction/utils/fallbackTransactions';
import { toast } from 'sonner';
import { isPlatform } from '@/utils/platformUtils';

interface KadoRedirectParams {
  amount: string;
  recipientName: string;
  recipientContact: string;
  country: string;
  paymentMethod: string;
  transactionId: string;
  returnUrl?: string;
}

// Kado integration constants
const KADO_BASE_URL = 'https://api.kado.money';
const KADO_REDIRECT_URL = `${KADO_BASE_URL}/v1/payments/redirect`;
const KADO_TEST_MODE = true; // Set to false in production

/**
 * Redirects user to Kado for payment processing with improved reliability
 */
const redirectToKado = async (params: KadoRedirectParams): Promise<void> => {
  try {
    console.log('📤 Redirecting to Kado with params:', params);
    
    // Create a reliable transaction ID
    const transactionId = params.transactionId;
    
    // Store transaction data immediately for resilience in multiple locations
    try {
      const transactionData = {
        id: transactionId,
        amount: params.amount,
        recipientName: params.recipientName,
        recipientContact: params.recipientContact,
        country: params.country,
        status: 'pending',
        paymentMethod: params.paymentMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: 'Processing'
      };
      
      // Store in multiple locations for redundancy
      localStorage.setItem(`transaction_${transactionId}`, JSON.stringify(transactionData));
      localStorage.setItem(`transaction_backup_${transactionId}`, JSON.stringify(transactionData));
      localStorage.setItem(`kado_transaction_${transactionId}`, JSON.stringify(params));
      sessionStorage.setItem(`transaction_session_${transactionId}`, JSON.stringify(transactionData));
      
      console.log(`💾 Pre-stored transaction data for ID: ${transactionId}`);
    } catch (e) {
      console.error('❌ Error pre-storing transaction data:', e);
    }
    
    // Show visual feedback to the user
    toast.success("Processing Payment", {
      description: "Preparing your transaction..."
    });
    
    // Create a fallback transaction right away to ensure it exists
    const fallbackTransaction = createFallbackTransaction(transactionId);
    console.log('✅ Created fallback transaction during redirect:', fallbackTransaction);
    
    // In test mode, simulate successful redirection
    if (KADO_TEST_MODE) {
      console.log('🧪 TEST MODE: Simulating Kado redirection');
      
      // Better visual feedback during transition
      const loadingDiv = document.createElement('div');
      loadingDiv.style.position = 'fixed';
      loadingDiv.style.top = '0';
      loadingDiv.style.left = '0';
      loadingDiv.style.width = '100%';
      loadingDiv.style.height = '100%';
      loadingDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
      loadingDiv.style.display = 'flex';
      loadingDiv.style.justifyContent = 'center';
      loadingDiv.style.alignItems = 'center';
      loadingDiv.style.zIndex = '10000';
      loadingDiv.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3>Preparing Transaction...</h3>
          <p>Please wait while we securely connect to the payment provider.</p>
        </div>
      `;
      document.body.appendChild(loadingDiv);
      
      // Simulate a brief delay then redirect to return URL or transaction page
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        document.body.removeChild(loadingDiv);
      } catch (e) {
        console.error('Error removing loading div:', e);
      }
      
      // Calculate return URL with fallbacks
      const returnUrl = params.returnUrl || `/transaction/${transactionId}`;
      const fullReturnUrl = returnUrl.startsWith('/') ? returnUrl : `/${returnUrl}`;
      console.log(`🔄 Redirecting to return URL: ${fullReturnUrl}`);
      
      // Use platform-aware navigation
      if (isPlatform('capacitor')) {
        // For mobile apps, ensure deep linking works
        try {
          // Fixed: Use correct App plugin method
          const { App } = await import('@capacitor/app');
          const appUrl = `${window.location.origin}${fullReturnUrl}`;
          console.log(`🔗 Opening URL via Capacitor: ${appUrl}`);
          // Use openUrl from the correctly imported App plugin
          await App.openUrl({ url: appUrl });
        } catch (e) {
          console.error('Error using Capacitor App.openUrl:', e);
          navigate(fullReturnUrl);
        }
      } else {
        // For web, use the navigate utility
        navigate(fullReturnUrl);
      }
      
      // Simulate a webhook call after navigation
      setTimeout(() => {
        try {
          // Import the transaction service dynamically to avoid circular dependencies
          import('@/services/transaction').then(module => {
            module.simulateWebhook(transactionId)
              .catch(e => console.error('Webhook simulation error:', e));
          });
        } catch (e) {
          console.error('Error importing simulateWebhook:', e);
        }
      }, 3000);
      
      return;
    }
    
    // Real implementation for production
    
    // Build the redirect URL with query parameters
    const queryParams = new URLSearchParams({
      amount: params.amount,
      recipient_name: params.recipientName,
      recipient_contact: params.recipientContact,
      country: params.country,
      payment_method: params.paymentMethod,
      transaction_id: transactionId,
      return_url: params.returnUrl || `${window.location.origin}/transaction/${transactionId}`,
      // Add widget ID from environment variables
      api_key: import.meta.env.VITE_KADO_WIDGET_ID || ''
    });
    
    const redirectUrl = `${KADO_REDIRECT_URL}?${queryParams.toString()}`;
    console.log(`🔄 Redirecting to Kado URL: ${redirectUrl}`);
    
    // Perform the actual redirect - different for mobile vs web
    if (isPlatform('capacitor')) {
      try {
        // Fixed: Properly import and use Browser plugin
        const { Browser } = await import('@capacitor/browser');
        await Browser.open({ url: redirectUrl });
      } catch (e) {
        console.error('Error opening browser:', e);
        window.location.href = redirectUrl;
      }
    } else {
      // Standard web redirect
      window.location.href = redirectUrl;
    }
  } catch (error) {
    console.error('❌ Error redirecting to Kado:', error);
    
    // Even on error, navigate to transaction page with error state
    const transactionUrl = `/transaction/${params.transactionId}?error=redirect_failed`;
    navigate(transactionUrl);
    
    throw new Error(`Failed to redirect to Kado: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const kadoRedirectService = {
  redirectToKado
};
