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
      
      // Enhanced localStorage storage with multiple backup keys
      const transactionKey = `transaction_${params.transactionId}`;
      const backupKey = `transaction_backup_${params.transactionId}`;
      const transactionData = JSON.stringify({
        ...transaction,
        transactionId: params.transactionId,
        createdAt: transaction.createdAt.toISOString(),
        updatedAt: transaction.updatedAt.toISOString()
      });
      
      // Store with primary key
      localStorage.setItem(transactionKey, transactionData);
      // Store with backup key
      localStorage.setItem(backupKey, transactionData);
      console.log(`Transaction stored in localStorage with keys: ${transactionKey} and ${backupKey}`, transaction);
      
      // Verify storage was successful
      const verifyStorage = () => {
        const storedData = localStorage.getItem(transactionKey);
        const backupData = localStorage.getItem(backupKey);
        
        if (!storedData && !backupData) {
          console.error(`ERROR: Failed to store transaction in localStorage! Keys: ${transactionKey}, ${backupKey}`);
          throw new Error('Failed to store transaction data locally');
        } else {
          console.log(`Verified transaction storage successful: ${(storedData || backupData)?.substring(0, 50)}...`);
          return true;
        }
      };
      
      // Keep trying to verify storage for up to 3 attempts
      let storageVerified = false;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!storageVerified && attempts < maxAttempts) {
        try {
          storageVerified = verifyStorage();
        } catch (e) {
          attempts++;
          if (attempts >= maxAttempts) throw e;
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // For high-value transactions, use biometric verification if available
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
      
      // CRITICAL: Ensure the webhook simulation happens BEFORE navigation
      // This promotes the transaction to "processing" state immediately
      try {
        console.log(`Simulating webhook for transaction ${params.transactionId} BEFORE navigation`);
        // Force the transaction to "processing" state immediately for better UX
        const { updateTransactionStatus } = await import('../transaction/transactionUpdate');
        await updateTransactionStatus(params.transactionId, 'processing');
        
        // Fire webhook simulation but don't wait for it to complete
        const { simulateKadoWebhook } = await import('../transaction/transactionUpdate');
        simulateKadoWebhook(params.transactionId).catch(err => {
          console.error('Background webhook simulation error:', err);
        });
      } catch (webhookError) {
        console.error('Error starting webhook simulation:', webhookError);
        // Continue anyway after logging the error
      }
      
      // CRITICAL FIX: Add a delay and ensure data is stored before navigation
      // This gives localStorage time to sync and webhook to start
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify one last time before navigation
      try {
        verifyStorage();
      } catch (error) {
        console.error('Final storage verification failed:', error);
        // Attempt emergency fallback
        localStorage.setItem(`emergency_transaction_${params.transactionId}`, transactionData);
      }
      
      console.log(`DATA VERIFIED - NOW navigating to transaction screen for ${params.transactionId}`);
      
      // Use direct window.location.href for more reliable navigation
      window.location.href = `/transaction/${params.transactionId}`;
      
      console.log('Kado redirect process completed successfully');
      return;
    } catch (error) {
      console.error('Error redirecting to Kado:', error);
      toast({
        title: "Error",
        description: "Could not redirect to payment provider. Please try again.",
        variant: "destructive"
      });
      
      // Create a fallback transaction in case of error
      if (params.transactionId) {
        try {
          const { updateTransactionStatus } = await import('../transaction/transactionUpdate');
          await updateTransactionStatus(params.transactionId, 'failed', {
            failureReason: error instanceof Error ? error.message : 'Unknown error during Kado redirect'
          });
          
          // Even after error, redirect to transaction page 
          window.location.href = `/transaction/${params.transactionId}`;
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
            
            localStorage.setItem(`transaction_${params.transactionId}`, JSON.stringify({
              ...transaction,
              createdAt: transaction.createdAt.toISOString(),
              updatedAt: transaction.updatedAt.toISOString()
            }));
            console.log(`Emergency fallback: stored failed transaction in localStorage for ${params.transactionId}`);
            
            // Still redirect to transaction page even after error
            window.location.href = `/transaction/${params.transactionId}`;
          } catch (storageError) {
            console.error('Failed emergency localStorage fallback:', storageError);
            // As last resort, direct navigation
            window.location.href = '/';
          }
        }
      } else {
        // If no transaction ID, go home
        window.location.href = '/';
      }
      
      throw error;
    }
  }
};
