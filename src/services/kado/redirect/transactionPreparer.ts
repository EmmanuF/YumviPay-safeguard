
import { supabase } from '@/integrations/supabase/client';
import { storeTransactionData } from './storageUtils';
import { addOfflineTransaction } from '@/services/transaction/store';
import { KadoRedirectParams } from './types';
import { Transaction } from '@/types/transaction';

/**
 * Prepares a transaction and stores it before redirection
 * @param params Redirect parameters
 * @returns Promise resolving to prepared transaction and user reference
 */
export const prepareTransaction = async (params: KadoRedirectParams): Promise<{
  transaction: Partial<Transaction>;
  userRef: string | null;
}> => {
  console.log('🔄 Preparing transaction with params:', params);
  
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
  
  // Store in IndexedDB/offline storage
  addOfflineTransaction(transaction);
  
  // Store in all redundant storage mechanisms
  const storageResult = await storeTransactionData(transaction, params.transactionId);
  
  if (!storageResult.verified) {
    console.error('❌ CRITICAL ERROR: Failed to verify transaction storage after multiple attempts');
    throw new Error('Could not store transaction data safely, aborting redirect');
  }
  
  console.log('✅ Transaction data storage verified successfully');
  
  return { transaction, userRef };
};
