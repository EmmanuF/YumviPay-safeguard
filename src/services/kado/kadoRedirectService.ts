
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { deepLinkService } from '../deepLinkService';
import { isPlatform } from '@/utils/platformUtils';
import { BiometricService } from '../biometric';
import { KadoRedirectParams } from './types';
import { addOfflineTransaction } from '../transaction/store';
import { simulateKadoWebhook } from '../transaction/transactionUpdate';

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
      console.log('🔄 kadoRedirectService.redirectToKado called with params:', params);
      
      // Get user ID if authenticated to use as userRef
      const { data: { session } } = await supabase.auth.getSession();
      let userRef = params.userRef;
      
      // If no userRef was provided but user is logged in, use their ID
      if (!userRef && session?.user?.id) {
        userRef = session.user.id;
        console.log(`📝 Using authenticated user ID as userRef: ${userRef}`);
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
      
      // 1. STORE DATA IMMEDIATELY IN MULTIPLE FORMATS
      console.log('📦 Storing transaction in all available storage mechanisms');
      
      // IndexedDB/offline storage
      addOfflineTransaction(transaction);
      
      // JSON serialized for localStorage/sessionStorage
      const transactionData = JSON.stringify({
        ...transaction,
        transactionId: params.transactionId,
        createdAt: transaction.createdAt.toISOString(),
        updatedAt: transaction.updatedAt.toISOString()
      });
      
      // Store in multiple locations with different keys for redundancy
      const storageKeys = [
        `transaction_${params.transactionId}`,
        `transaction_backup_${params.transactionId}`,
        `emergency_transaction_${params.transactionId}`,
        `transaction_session_${params.transactionId}`,
        `pending_transaction_${Date.now()}`,
        `latest_transaction`
      ];
      
      // Store in localStorage
      storageKeys.forEach(key => {
        try {
          localStorage.setItem(key, transactionData);
        } catch (e) {
          console.error(`❌ Failed to store in localStorage with key ${key}:`, e);
        }
      });
      
      // Store in sessionStorage as well
      try {
        sessionStorage.setItem(`transaction_session_${params.transactionId}`, transactionData);
        sessionStorage.setItem('lastTransactionId', params.transactionId);
      } catch (e) {
        console.error('❌ Error storing in sessionStorage:', e);
      }
      
      // Store with window object as last resort
      try {
        // @ts-ignore - Using window as emergency backup
        window.__EMERGENCY_TRANSACTION = transactionData;
      } catch (e) {
        console.error('❌ Error storing in window object:', e);
      }
      
      // 2. VERIFY STORAGE SUCCESS
      console.log('🔍 Verifying data was successfully stored...');
      
      let storageVerified = false;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!storageVerified && attempts < maxAttempts) {
        attempts++;
        
        // Check multiple storage locations
        const storedData = [
          localStorage.getItem(`transaction_${params.transactionId}`),
          localStorage.getItem(`transaction_backup_${params.transactionId}`),
          sessionStorage.getItem(`transaction_session_${params.transactionId}`)
        ];
        
        // If any storage method succeeded, we're good
        storageVerified = storedData.some(data => !!data);
        
        if (!storageVerified) {
          console.log(`⚠️ Storage verification failed on attempt ${attempts}/${maxAttempts}, retrying...`);
          
          // Try storage again with all methods
          storageKeys.forEach(key => {
            try {
              localStorage.setItem(key, transactionData);
            } catch (e) {}
          });
          
          try {
            sessionStorage.setItem(`transaction_session_${params.transactionId}`, transactionData);
            sessionStorage.setItem('lastTransactionId', params.transactionId);
          } catch (e) {}
          
          // Small delay between attempts
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      if (!storageVerified) {
        console.error('❌ CRITICAL ERROR: Failed to verify transaction storage after multiple attempts');
        throw new Error('Could not store transaction data safely, aborting redirect');
      }
      
      console.log('✅ Transaction data storage verified successfully');
      
      // 3. OPTIONAL BIOMETRIC CHECK FOR HIGH-VALUE TRANSACTIONS
      if (parseFloat(params.amount) > 100) {
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
          console.error('❓ Biometric authentication error:', bioError);
          // Continue without biometric auth if there's an error
        }
      }
      
      // 4. PREPARE RETURN URL
      const returnUrl = isPlatform('mobile') && params.deepLinkBack
        ? deepLinkService.generateDeepLink(`transaction/${params.transactionId}`, { source: 'kado', userRef: userRef || 'guest' })
        : params.returnUrl || `${window.location.origin}/transaction/${params.transactionId}`;
      
      // For debugging - this is a simplified mock URL
      const kadoUrl = `https://kado.com/pay?amount=${params.amount}&recipient=${encodeURIComponent(params.recipientName)}&country=${params.country}&payment_method=${params.paymentMethod}&transaction_id=${params.transactionId}&return_url=${encodeURIComponent(returnUrl)}&user_ref=${userRef || 'guest'}`;
      
      console.log(`🔄 Redirecting to Kado (simulated): ${kadoUrl}`);
      console.log(`🔙 Return URL: ${returnUrl}`);
      
      // 5. SHOW REDIRECT TOAST
      toast({
        title: "Redirecting to Payment Provider",
        description: "You will be redirected to complete KYC and payment"
      });
      
      // 6. UPDATE TRANSACTION STATUS TO PROCESSING
      try {
        console.log('📝 Updating transaction status to processing...');
        const { updateTransactionStatus } = await import('../transaction/transactionUpdate');
        await updateTransactionStatus(params.transactionId, 'processing');
        
        // Simulate webhook response in background
        simulateKadoWebhook(params.transactionId).catch(err => {
          console.error('⚠️ Background webhook simulation error:', err);
        });
      } catch (updateError) {
        console.error('❌ Error starting transaction update:', updateError);
      }
      
      // 7. CRITICAL: ENSURE DATA IS STORED BEFORE NAVIGATION
      // This longer delay is crucial for reliable operation
      console.log('⏱️ Waiting to ensure data persistence before navigation...');
      
      // Create a visible indicator that we're waiting
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
          <h3>Preparing Secure Payment...</h3>
          <p>Please wait while we securely prepare your transaction.</p>
        </div>
      `;
      document.body.appendChild(loadingDiv);
      
      // Wait with a longer timeout to ensure data persistence
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 8. NAVIGATE TO TRANSACTION SCREEN DIRECTLY INSTEAD OF KADO
      // This is a crucial fix - we're skipping actual Kado redirect for testing
      try {
        console.log('✅ ALL DATA VERIFIED - Now navigating to transaction screen');
        
        // Remove loading indicator
        document.body.removeChild(loadingDiv);
        
        // For testing purposes, we'll navigate directly to the transaction screen
        // In production, this would be an actual redirect to Kado
        window.location.href = `/transaction/${params.transactionId}`;
        
        return;
      } catch (navError) {
        console.error('❌ Navigation error:', navError);
        document.body.removeChild(loadingDiv);
        throw navError;
      }
    } catch (error) {
      console.error('❌ Error in Kado redirect process:', error);
      toast({
        title: "Error",
        description: "Could not redirect to payment provider. Please try again.",
        variant: "destructive"
      });
      
      // Create a fallback transaction if we have a transaction ID
      if (params.transactionId) {
        try {
          const { updateTransactionStatus } = await import('../transaction/transactionUpdate');
          await updateTransactionStatus(params.transactionId, 'failed', {
            failureReason: error instanceof Error ? error.message : 'Unknown error during Kado redirect'
          });
          
          window.location.href = `/transaction/${params.transactionId}`;
        } catch (updateError) {
          console.error('❌ Error updating transaction status after redirect error:', updateError);
          window.location.href = '/';
        }
      } else {
        window.location.href = '/';
      }
      
      throw error;
    }
  }
};
