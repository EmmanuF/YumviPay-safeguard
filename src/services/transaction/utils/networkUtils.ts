
// Network and offline utilities for transaction creation
import { Transaction } from "@/types/transaction";
import { isOffline, addPausedRequest } from "@/utils/networkUtils";

// Get user ID from current session
export const getUserId = async (): Promise<string | null> => {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id || null;
};

// Handle offline transaction storage
export const addOfflineTransaction = async (transaction: Transaction) => {
  const { getOfflineTransactions, setOfflineTransactions } = await import('../store');
  // Need to await the Promise result from getOfflineTransactions
  const offlineTransactions = await getOfflineTransactions();
  setOfflineTransactions([...offlineTransactions, transaction]);
};

// Update a transaction in the offline cache
export const updateLocalTransaction = async (id: string, updatedTransaction: Transaction) => {
  const { getOfflineTransactions, setOfflineTransactions } = await import('../store');
  // Need to await the Promise result from getOfflineTransactions
  const offlineTransactions = await getOfflineTransactions();
  const index = offlineTransactions.findIndex(t => t.id === id);
  if (index >= 0) {
    offlineTransactions[index] = updatedTransaction;
    // Need to await the Promise result from setOfflineTransactions
    await setOfflineTransactions([...offlineTransactions]);
  }
};

// Send transaction to Supabase
export const sendTransactionToSupabase = async (transaction: Transaction) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const userId = await getUserId();
    
    if (!userId) {
      console.error('User not authenticated');
      await addOfflineTransaction(transaction);
      return { data: null, error: new Error('User not authenticated') };
    }
    
    const result = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        recipient_id: transaction.recipientId,
        amount: typeof transaction.amount === 'number' ? transaction.amount.toString() : transaction.amount,
        fee: typeof transaction.fee === 'number' ? transaction.fee.toString() : transaction.fee,
        recipient_name: transaction.recipientName,
        recipient_contact: transaction.recipientContact,
        payment_method: transaction.paymentMethod,
        provider: transaction.provider,
        country: transaction.country,
        status: transaction.status,
        created_at: transaction.createdAt.toISOString(),
        updated_at: transaction.updatedAt.toISOString(),
        estimated_delivery: transaction.estimatedDelivery,
        total_amount: typeof transaction.totalAmount === 'number' 
          ? transaction.totalAmount.toString() 
          : transaction.totalAmount,
        is_recurring: transaction.isRecurring,
        recurring_payment_id: transaction.recurringPaymentId
      })
      .select()
      .single();
      
    if (result.data) {
      console.log('Transaction created in Supabase:', result.data);
    }
    return result;
  } catch (error) {
    console.error('Error creating transaction via Supabase:', error);
    // Add to local storage as fallback
    await addOfflineTransaction(transaction);
    throw error;
  }
};
