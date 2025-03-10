
import { Transaction, TransactionStatus } from "@/types/transaction";
import { supabase } from "@/integrations/supabase/client";
import { isOffline, addPausedRequest } from "@/utils/networkUtils";

// Simulate a webhook from Kado to update transaction status
export const simulateKadoWebhook = async (transactionId: string): Promise<void> => {
  // Wait for 3 seconds to simulate external API call
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Set the transaction to 'processing' first
  await updateTransactionStatus(transactionId, 'processing');
  
  // After another delay, complete the transaction
  setTimeout(async () => {
    // 90% chance of success, 10% chance of failure
    const success = Math.random() < 0.9;
    
    if (success) {
      await updateTransactionStatus(
        transactionId, 
        'completed', 
        { 
          completedAt: new Date() 
        }
      );
    } else {
      await updateTransactionStatus(
        transactionId, 
        'failed', 
        { 
          failureReason: 'Payment verification failed'
        }
      );
    }
  }, 5000);
};

// Update transaction status in Supabase and local storage
export const updateTransactionStatus = async (
  transactionId: string,
  status: TransactionStatus,
  options?: {
    completedAt?: Date;
    failureReason?: string;
  }
): Promise<Transaction | null> => {
  // Prepare update data for database
  const updateData: Record<string, any> = {
    status,
    updated_at: new Date().toISOString()
  };
  
  // Add optional fields if provided
  if (options?.completedAt) {
    updateData.completed_at = options.completedAt.toISOString();
  }
  
  if (options?.failureReason) {
    updateData.failure_reason = options.failureReason;
  }
  
  // If offline, update local storage and queue Supabase update
  if (isOffline()) {
    // First update the local transaction
    await updateLocalTransaction(transactionId, status, options);
    
    // Then queue the Supabase update for when connection is restored
    addPausedRequest(async () => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transactionId)
        .select()
        .single();
        
      if (error) {
        console.error(`Error updating transaction ${transactionId}:`, error);
        throw error;
      }
      
      return data;
    });
    
    // Return the locally updated transaction
    return getLocalTransaction(transactionId);
  }
  
  // If online, update Supabase directly
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId)
      .select()
      .single();
      
    if (error) throw error;
    
    if (!data) return null;
    
    // Also update local storage for consistency
    await updateLocalTransaction(transactionId, status, options);
    
    // Convert database record to Transaction object
    return {
      id: data.id,
      amount: data.amount,
      fee: data.fee,
      recipientId: data.recipient_id,
      recipientName: data.recipient_name,
      recipientContact: data.recipient_contact,
      paymentMethod: data.payment_method,
      provider: data.provider,
      country: data.country,
      status: data.status as TransactionStatus,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      failureReason: data.failure_reason,
      estimatedDelivery: data.estimated_delivery,
      totalAmount: data.total_amount
    };
  } catch (error) {
    console.error(`Error updating transaction ${transactionId}:`, error);
    
    // Update local storage as fallback
    await updateLocalTransaction(transactionId, status, options);
    
    // Return the locally updated transaction
    return getLocalTransaction(transactionId);
  }
};

// Update a transaction in local storage
const updateLocalTransaction = async (
  transactionId: string,
  status: TransactionStatus,
  options?: {
    completedAt?: Date;
    failureReason?: string;
  }
): Promise<void> => {
  const { getOfflineTransactions, setOfflineTransactions } = await import('./transactionStore');
  
  const transactions = getOfflineTransactions();
  const index = transactions.findIndex(t => t.id === transactionId);
  
  if (index >= 0) {
    const updatedTransaction = {
      ...transactions[index],
      status,
      updatedAt: new Date(),
      ...(options?.completedAt && { completedAt: options.completedAt }),
      ...(options?.failureReason && { failureReason: options.failureReason })
    };
    
    transactions[index] = updatedTransaction;
    setOfflineTransactions([...transactions]);
  }
};

// Get a transaction from local storage
const getLocalTransaction = async (transactionId: string): Promise<Transaction | null> => {
  const { getOfflineTransactions } = await import('./transactionStore');
  
  const transactions = getOfflineTransactions();
  return transactions.find(t => t.id === transactionId) || null;
};
