
import { Transaction, TransactionStatus } from "@/types/transaction";
import { Recipient } from "@/types/recipient";
import { supabase } from "@/integrations/supabase/client";
import { 
  calculateFee, 
  calculateTotal, 
  generateTransactionId, 
  getEstimatedDelivery
} from "@/utils/transactionUtils";
import { useNetwork } from "@/contexts/NetworkContext";

// Create a new transaction
export const createTransaction = (
  amount: string,
  recipient: Recipient,
  paymentMethod: string,
  provider?: string
): Transaction => {
  const { isOffline, addPausedRequest } = useNetwork();
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
    totalAmount
  };
  
  if (isOffline) {
    // Store transaction locally if offline
    addOfflineTransaction(transaction);
    
    // Queue the Supabase insert for when connection is restored
    addPausedRequest(async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .insert({
            id: transaction.id,
            recipient_id: transaction.recipientId,
            amount: transaction.amount,
            fee: transaction.fee,
            recipient_name: transaction.recipientName,
            recipient_contact: transaction.recipientContact,
            payment_method: transaction.paymentMethod,
            provider: transaction.provider,
            country: transaction.country,
            status: 'pending', // Change from offline-pending to pending
            created_at: transaction.createdAt.toISOString(),
            updated_at: transaction.updatedAt.toISOString(),
            estimated_delivery: transaction.estimatedDelivery,
            total_amount: transaction.totalAmount
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
  
  try {
    // Send to Supabase if online - but don't wait for response
    supabase
      .from('transactions')
      .insert({
        id: transaction.id,
        recipient_id: transaction.recipientId,
        amount: transaction.amount,
        fee: transaction.fee,
        recipient_name: transaction.recipientName,
        recipient_contact: transaction.recipientContact,
        payment_method: transaction.paymentMethod,
        provider: transaction.provider,
        country: transaction.country,
        status: transaction.status,
        created_at: transaction.createdAt.toISOString(),
        updated_at: transaction.updatedAt.toISOString(),
        estimated_delivery: transaction.estimatedDelivery,
        total_amount: transaction.totalAmount
      })
      .select()
      .single()
      .then(({ data }) => {
        console.log('Transaction created in Supabase:', data);
      })
      .catch(error => {
        console.error('Error creating transaction via Supabase:', error);
        // Add to local storage as fallback
        addOfflineTransaction(transaction);
      });
    
    return transaction;
  } catch (error) {
    // Fallback to local storage on API error
    console.error('Error creating transaction via API:', error);
    addOfflineTransaction(transaction);
    return transaction;
  }
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
