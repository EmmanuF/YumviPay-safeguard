
import { Transaction, TransactionStatus } from "@/types/transaction";
import { supabase } from "@/integrations/supabase/client";
import { isOffline, addPausedRequest } from "@/utils/networkUtils";

// Simulate a webhook from Kado to update transaction status
export const simulateKadoWebhook = async (transactionId: string): Promise<void> => {
  console.log(`Simulating Kado webhook for transaction: ${transactionId}`);
  
  // Wait for 1 second to simulate external API call (reduced from 3 seconds)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Set the transaction to 'processing' first
    await updateTransactionStatus(transactionId, 'processing');
    
    // After another shorter delay, complete the transaction (reduced from 5 seconds to 2 seconds)
    setTimeout(async () => {
      try {
        // 95% chance of success, 5% chance of failure (increased success rate)
        const success = Math.random() < 0.95;
        
        if (success) {
          await updateTransactionStatus(
            transactionId, 
            'completed', 
            { 
              completedAt: new Date() 
            }
          );
          console.log(`Transaction ${transactionId} marked as completed`);
        } else {
          await updateTransactionStatus(
            transactionId, 
            'failed', 
            { 
              failureReason: 'Payment verification failed'
            }
          );
          console.log(`Transaction ${transactionId} marked as failed`);
        }
      } catch (error) {
        console.error(`Error updating transaction ${transactionId} in second phase:`, error);
      }
    }, 2000);
  } catch (error) {
    console.error(`Error initiating webhook simulation for ${transactionId}:`, error);
  }
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
  console.log(`Updating transaction ${transactionId} status to ${status}`);
  
  // Skip Supabase update for non-UUID transaction IDs (our mock transactions)
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(transactionId);
  
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
  
  // If offline, update local storage and queue Supabase update if it's a valid UUID
  if (isOffline()) {
    // First update the local transaction
    await updateLocalTransaction(transactionId, status, options);
    
    // Then queue the Supabase update for when connection is restored (only if valid UUID)
    if (isValidUuid) {
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
    }
    
    // Return the locally updated transaction
    return getLocalTransaction(transactionId);
  }
  
  // If online and it's a valid UUID, update Supabase
  if (isValidUuid) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transactionId)
        .select()
        .single();
        
      if (error) {
        console.error(`Error updating transaction ${transactionId}:`, error);
        // Fall back to local update but don't throw
      } else if (data) {
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
      }
    } catch (error) {
      console.error(`Error updating transaction ${transactionId} in Supabase:`, error);
      // Continue with local update below
    }
  } else {
    console.log(`Transaction ID ${transactionId} is not a valid UUID, skipping Supabase update`);
  }
  
  // Update local storage in all cases
  await updateLocalTransaction(transactionId, status, options);
  
  // Return the locally updated transaction
  return getLocalTransaction(transactionId);
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
    console.log(`Transaction ${transactionId} updated in local storage`);
  } else {
    console.warn(`Transaction ${transactionId} not found in local storage`);
  }
};

// Get a transaction from local storage
const getLocalTransaction = async (transactionId: string): Promise<Transaction | null> => {
  const { getOfflineTransactions } = await import('./transactionStore');
  
  const transactions = getOfflineTransactions();
  const transaction = transactions.find(t => t.id === transactionId);
  
  if (!transaction) {
    console.warn(`Transaction ${transactionId} not found in local storage`);
  }
  
  return transaction || null;
};
