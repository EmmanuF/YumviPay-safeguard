
import { Transaction, TransactionStatus } from "@/types/transaction";
import { Recipient } from "@/types/recipient";
import { supabase } from "@/integrations/supabase/client";
import { 
  calculateFee, 
  calculateTotal, 
  generateTransactionId, 
  getEstimatedDelivery
} from "@/utils/transactionUtils";

// Create a network status utility to replace useNetwork hook
const getNetworkStatus = (): { 
  isOffline: boolean, 
  addPausedRequest: (callback: () => Promise<any>) => void 
} => {
  // Check if navigator.onLine is available (browser environment)
  const isOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false;
  
  // Create a simple version of addPausedRequest that works outside of React components
  const addPausedRequest = (callback: () => Promise<any>) => {
    if (isOffline) {
      // Store the request in localStorage to be executed when online
      const requests = JSON.parse(localStorage.getItem('pausedRequests') || '[]');
      requests.push({
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('pausedRequests', JSON.stringify(requests));
      
      // Add event listener to execute when online (if in browser)
      if (typeof window !== 'undefined') {
        const executeRequest = () => {
          callback()
            .then(() => {
              console.log('Paused request executed successfully');
              window.removeEventListener('online', executeRequest);
            })
            .catch(error => {
              console.error('Error executing paused request:', error);
            });
        };
        
        window.addEventListener('online', executeRequest);
      }
    } else {
      // Execute immediately if online
      callback()
        .catch(error => {
          console.error('Error executing request:', error);
        });
    }
  };
  
  return { isOffline, addPausedRequest };
};

// Get user ID from current session
const getUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id || null;
};

// Create a new transaction
export const createTransaction = (
  amount: string,
  recipient: Recipient,
  paymentMethod: string,
  provider?: string,
  isRecurring: boolean = false,
  recurringPaymentId?: string
): Transaction => {
  const { isOffline, addPausedRequest } = getNetworkStatus();
  const fee = calculateFee(amount, recipient.country);
  const totalAmount = calculateTotal(amount, fee);
  
  // Create transaction object
  const transaction: Transaction = {
    id: generateTransactionId(),
    amount,
    fee,
    recipientId: recipient.id,
    recipientName: recipient.name,
    recipientContact: recipient.contact,
    paymentMethod,
    provider,
    country: recipient.country,
    status: isOffline ? 'offline-pending' : 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDelivery: getEstimatedDelivery(recipient.country, paymentMethod),
    totalAmount,
    isRecurring: isRecurring,
    recurringPaymentId
  };
  
  if (isOffline) {
    // Store transaction locally if offline
    addOfflineTransaction(transaction);
    
    // Queue the Supabase insert for when connection is restored
    addPausedRequest(async () => {
      try {
        const userId = await getUserId();
        if (!userId) throw new Error('User not authenticated');
        
        const { data, error } = await supabase
          .from('transactions')
          .insert({
            // Don't specify id here, let Supabase generate it
            user_id: userId,
            recipient_id: transaction.recipientId,
            amount: typeof transaction.amount === 'number' ? transaction.amount.toString() : transaction.amount,
            fee: typeof transaction.fee === 'number' ? transaction.fee.toString() : transaction.fee,
            recipient_name: transaction.recipientName,
            recipient_contact: transaction.recipientContact,
            payment_method: transaction.paymentMethod,
            provider: transaction.provider,
            country: transaction.country,
            status: 'pending', // Change from offline-pending to pending
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
          
        if (error) throw error;
        
        // Update the local transaction with server data
        updateLocalTransaction(transaction.id, {
          ...transaction,
          status: 'pending'
        });
        
        return data;
      } catch (error) {
        console.error('Failed to sync transaction:', error);
        throw error;
      }
    });
    
    return transaction;
  }
  
  // Send to Supabase if online - but don't wait for response
  const sendToSupabase = async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        console.error('User not authenticated');
        addOfflineTransaction(transaction);
        return { data: null, error: new Error('User not authenticated') };
      }
      
      const result = await supabase
        .from('transactions')
        .insert({
          // Don't include ID in insert, let Supabase generate it
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
      addOfflineTransaction(transaction);
      throw error;
    }
  };
  
  // Execute the Supabase request asynchronously
  sendToSupabase().catch(error => {
    console.error('Failed to send transaction to Supabase:', error);
  });
  
  return transaction;
};

// Add a transaction to the offline cache
// This is an internal function used by the module
const addOfflineTransaction = (transaction: Transaction) => {
  import("./transactionStore").then(({ getOfflineTransactions, setOfflineTransactions }) => {
    const offlineTransactions = getOfflineTransactions();
    setOfflineTransactions([...offlineTransactions, transaction]);
  });
};

// Update a transaction in the offline cache
// This is an internal function used by the module
const updateLocalTransaction = (id: string, updatedTransaction: Transaction) => {
  import("./transactionStore").then(({ getOfflineTransactions, setOfflineTransactions }) => {
    const offlineTransactions = getOfflineTransactions();
    const index = offlineTransactions.findIndex(t => t.id === id);
    if (index >= 0) {
      offlineTransactions[index] = updatedTransaction;
      setOfflineTransactions([...offlineTransactions]);
    }
  });
};
