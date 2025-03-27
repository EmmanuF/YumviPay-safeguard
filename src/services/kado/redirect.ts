
/**
 * Kado redirect service for payment processing
 */

import { navigate } from '@/utils/navigationUtils';
import { createFallbackTransaction } from '@/services/transaction/utils/fallbackTransactions';
import { toast } from 'sonner';

interface KadoRedirectParams {
  amount: string;
  recipientName: string;
  recipientContact: string;
  country: string;
  paymentMethod: string;
  transactionId: string;
  returnUrl?: string;
}

// Kado integration constants - Now using environment variable
const KADO_BASE_URL = 'https://api.kado.money';
const KADO_REDIRECT_URL = `${KADO_BASE_URL}/v1/payments/redirect`;
const KADO_TEST_MODE = true; // Set to false in production

/**
 * Redirects user to Kado for payment processing
 */
const redirectToKado = async (params: KadoRedirectParams): Promise<void> => {
  try {
    console.log('📤 Redirecting to Kado with params:', params);
    
    // Store transaction data immediately for resilience
    try {
      const transactionData = {
        id: params.transactionId,
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
      
      localStorage.setItem(`transaction_${params.transactionId}`, JSON.stringify(transactionData));
      localStorage.setItem(`transaction_backup_${params.transactionId}`, JSON.stringify(transactionData));
      console.log(`💾 Pre-stored transaction data for ID: ${params.transactionId}`);
    } catch (e) {
      console.error('❌ Error pre-storing transaction data:', e);
    }
    
    // In test mode, simulate successful redirection
    if (KADO_TEST_MODE) {
      console.log('🧪 TEST MODE: Simulating Kado redirection');
      
      // Store transaction data for later retrieval with more fields
      localStorage.setItem(`kado_transaction_${params.transactionId}`, JSON.stringify({
        ...params,
        status: 'pending',
        timestamp: new Date().toISOString()
      }));
      
      // Create a fallback transaction right away to ensure it exists
      const fallbackTransaction = createFallbackTransaction(params.transactionId);
      console.log('✅ Created fallback transaction during redirect:', fallbackTransaction);
      
      toast.success("Processing Payment", {
        description: "Redirecting to payment processor..."
      });
      
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
        console.error('Error removing loading overlay:', e);
      }
      
      const returnUrl = params.returnUrl || `/transaction/${params.transactionId}`;
      console.log(`🔄 Redirecting to return URL: ${returnUrl}`);
      
      // Use navigate utility to handle the redirect with replaceState
      navigate(returnUrl);
      
      // Simulate a webhook call 3 seconds later
      setTimeout(() => {
        try {
          import('@/services/transaction').then(module => {
            module.simulateWebhook(params.transactionId, 'completed')
              .catch(e => console.error('Webhook simulation error:', e));
          });
        } catch (e) {
          console.error('Error importing simulateWebhook:', e);
        }
      }, 3000);
      
      return;
    }
    
    // Build the redirect URL with query parameters
    const queryParams = new URLSearchParams({
      amount: params.amount,
      recipient_name: params.recipientName,
      recipient_contact: params.recipientContact,
      country: params.country,
      payment_method: params.paymentMethod,
      transaction_id: params.transactionId,
      return_url: params.returnUrl || `${window.location.origin}/transaction/${params.transactionId}`,
      // Add widget ID from environment variables
      api_key: import.meta.env.VITE_KADO_WIDGET_ID || ''
    });
    
    const redirectUrl = `${KADO_REDIRECT_URL}?${queryParams.toString()}`;
    console.log(`🔄 Redirecting to Kado URL: ${redirectUrl}`);
    
    // Perform the actual redirect
    window.location.href = redirectUrl;
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
