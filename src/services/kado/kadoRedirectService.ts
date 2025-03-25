import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { deepLinkService } from '../deepLinkService';
import { isPlatform } from '@/utils/platformUtils';
import { BiometricService } from '../biometric';
import { KadoRedirectParams } from './types';
import { navigate } from '@/utils/navigationUtils';
import { addOfflineTransaction } from '../transaction/transactionStore';
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
      
      // Synchronous localStorage operation - critical for data persistence!
      const transactionKey = `transaction_${params.transactionId}`;
      const backupKey = `transaction_backup_${params.transactionId}`;
      const emergencyKey = `emergency_transaction_${params.transactionId}`;
      const transactionData = JSON.stringify({
        ...transaction,
        transactionId: params.transactionId,
        createdAt: transaction.createdAt.toISOString(),
        updatedAt: transaction.updatedAt.toISOString()
      });
      
      // Store with multiple keys for redundancy
      localStorage.setItem(transactionKey, transactionData);
      localStorage.setItem(backupKey, transactionData);
      localStorage.setItem(emergencyKey, transactionData);
      console.log(`Transaction stored in localStorage with keys: ${transactionKey}, ${backupKey}, and ${emergencyKey}`, transaction);
      
      // Force a validation of storage success (important!!)
      const validateStorage = () => {
        const data1 = localStorage.getItem(transactionKey);
        const data2 = localStorage.getItem(backupKey);
        const data3 = localStorage.getItem(emergencyKey);
        
        if (!data1 && !data2 && !data3) {
          console.error('CRITICAL ERROR: All attempts to store transaction failed!');
          return false;
        }
        
        console.log(`Storage validation succeeded: Found ${data1 ? 'primary' : ''}${data2 ? ' backup' : ''}${data3 ? ' emergency' : ''} storage.`);
        return true;
      };
      
      // Verify storage was successful - try multiple times
      let storageVerified = false;
      let storageAttempts = 0;
      const maxStorageAttempts = 3;
      
      while (!storageVerified && storageAttempts < maxStorageAttempts) {
        storageVerified = validateStorage();
        if (!storageVerified) {
          console.log(`Storage verification failed on attempt ${storageAttempts + 1}/${maxStorageAttempts}, retrying...`);
          
          // Try storage again
          localStorage.setItem(transactionKey, transactionData);
          localStorage.setItem(backupKey, transactionData);
          localStorage.setItem(emergencyKey, transactionData);
          
          storageAttempts++;
          
          // Small delay between attempts
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
      if (!storageVerified) {
        throw new Error('Failed to verify transaction storage after multiple attempts');
      }
      
      // Biometric verification for high-value transactions (unchanged)
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
          console.error('Biometric authentication error:', bioError);
          // Continue without biometric auth if there's an error
        }
      }
      
      // Generate appropriate return URL (simplified from original)
      const returnUrl = isPlatform('mobile') && params.deepLinkBack
        ? deepLinkService.generateDeepLink(`transaction/${params.transactionId}`, { source: 'kado', userRef: userRef || 'guest' })
        : params.returnUrl || `${window.location.origin}/transaction/${params.transactionId}`;
      
      // Simplified mock URL for Kado redirection
      const kadoUrl = `https://kado.com/pay?amount=${params.amount}&recipient=${encodeURIComponent(params.recipientName)}&country=${params.country}&payment_method=${params.paymentMethod}&transaction_id=${params.transactionId}&return_url=${encodeURIComponent(returnUrl)}&user_ref=${userRef || 'guest'}`;
      
      console.log(`Redirecting to Kado (simulated): ${kadoUrl}`);
      console.log(`Return URL: ${returnUrl}`);
      
      // Show toast indicating redirection
      toast({
        title: "Redirecting to Payment Provider",
        description: "You will be redirected to complete KYC and payment"
      });
      
      // CRITICAL: Promote the transaction to "processing" state BEFORE redirecting
      try {
        const { updateTransactionStatus } = await import('../transaction/transactionUpdate');
        await updateTransactionStatus(params.transactionId, 'processing');
        
        // Fire webhook simulation but don't wait for it
        simulateKadoWebhook(params.transactionId).catch(err => {
          console.error('Background webhook simulation error:', err);
        });
      } catch (updateError) {
        console.error('Error starting transaction update:', updateError);
      }
      
      // CRITICAL: Ensure data is stored by waiting before navigation
      // This is the most important fix - adding a longer delay!
      console.log('Waiting to ensure data persistence before navigation...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Final storage verification
      if (!validateStorage()) {
        console.error('CRITICAL: Final storage verification failed!');
        
        // Emergency measure: one more attempt with a different approach
        const sessionStorageKey = `transaction_session_${params.transactionId}`;
        sessionStorage.setItem(sessionStorageKey, transactionData);
        sessionStorage.setItem('lastTransactionId', params.transactionId);
        
        console.log('Emergency backup created in sessionStorage');
      }
      
      console.log(`ALL DATA VERIFIED - Now navigating to transaction screen for ${params.transactionId}`);
      
      // Use direct location replace for the most reliable navigation
      window.location.replace(`/transaction/${params.transactionId}`);
      
      return;
    } catch (error) {
      console.error('Error in Kado redirect process:', error);
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
          
          window.location.replace(`/transaction/${params.transactionId}`);
        } catch (updateError) {
          console.error('Error updating transaction status after redirect error:', updateError);
          window.location.replace('/');
        }
      } else {
        window.location.replace('/');
      }
      
      throw error;
    }
  }
};
