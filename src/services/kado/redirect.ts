
/**
 * Kado redirect service for payment processing
 */

import { navigate } from '@/utils/navigationUtils';

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
    
    // In test mode, simulate successful redirection
    if (KADO_TEST_MODE) {
      console.log('🧪 TEST MODE: Simulating Kado redirection');
      
      // Store transaction data for later retrieval
      localStorage.setItem(`kado_transaction_${params.transactionId}`, JSON.stringify({
        ...params,
        status: 'pending',
        timestamp: new Date().toISOString()
      }));
      
      // Simulate a brief delay then redirect to return URL or transaction page
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const returnUrl = params.returnUrl || `/transaction/${params.transactionId}`;
      console.log(`🔄 Redirecting to return URL: ${returnUrl}`);
      
      // Use navigate utility to handle the redirect
      navigate(returnUrl);
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
    throw new Error(`Failed to redirect to Kado: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const kadoRedirectService = {
  redirectToKado
};
