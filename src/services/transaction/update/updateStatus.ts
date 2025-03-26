
import { Transaction, TransactionStatus } from "@/types/transaction";
import { supabase } from "@/integrations/supabase/client";
import { isOffline, addPausedRequest } from "@/utils/networkUtils";
import { updateLocalTransaction, getLocalTransaction } from './localTransactionUtils';

// Helper function to check if a transaction exists
export const checkTransactionExists = async (transactionId: string): Promise<boolean> => {
  try {
    // Try localStorage first
    const localData = localStorage.getItem(`transaction_${transactionId}`);
    if (localData) {
      console.log(`Transaction ${transactionId} exists in localStorage`);
      return true;
    }
    
    // If not in localStorage, check offline storage
    const { getOfflineTransactions } = await import('../store');
    const transactions = getOfflineTransactions();
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (transaction) {
      console.log(`Transaction ${transactionId} exists in offline storage`);
      return true;
    }
    
    console.warn(`Transaction ${transactionId} not found in any local storage!`);
    return false;
  } catch (error) {
    console.error(`Error checking transaction existence for ${transactionId}:`, error);
    return false;
  }
};

// Update transaction status in Supabase and local storage with improved reliability
export const updateTransactionStatus = async (
  transactionId: string,
  status: TransactionStatus,
  options?: {
    completedAt?: Date;
    failureReason?: string;
  }
): Promise<Transaction | null> => {
  console.log(`Updating transaction ${transactionId} status to ${status}`);
  
  // Update local storage first for immediate feedback 
  // This is critical for ensuring the UI shows the updated status
  const locallyUpdated = await updateLocalTransaction(transactionId, status, options);
  if (!locallyUpdated) {
    console.error(`Failed to update transaction ${transactionId} locally!`);
    // Still try Supabase if applicable
  }
  
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
  
  // If offline, queue Supabase update if it's a valid UUID
  if (isOffline()) {
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
      } else if (data) {
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
    }
  } else {
    console.log(`Transaction ID ${transactionId} is not a valid UUID, using local storage only`);
  }
  
  // Return the locally updated transaction
  return getLocalTransaction(transactionId);
};
