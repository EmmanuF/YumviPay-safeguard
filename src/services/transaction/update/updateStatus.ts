
import { Transaction, TransactionStatus } from "@/types/transaction";
import { supabase } from "@/integrations/supabase/client";

/**
 * Update a transaction's status
 * @param transactionId Transaction ID
 * @param status New status
 * @param options Additional options
 * @returns Updated transaction
 */
export const updateTransactionStatus = async (
  transactionId: string, 
  status: TransactionStatus,
  options: {
    failureReason?: string;
    completedAt?: Date;
    [key: string]: any;
  } = {}
): Promise<Transaction | null> => {
  try {
    console.log(`Updating transaction ${transactionId} to status: ${status}`, options);
    
    // Prepare the update data
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    // Add completed_at if completed
    if (status === 'completed') {
      updateData.completed_at = options.completedAt 
        ? options.completedAt.toISOString() 
        : new Date().toISOString();
    }
    
    // Add failure_reason if failed
    if (status === 'failed' && options.failureReason) {
      updateData.failure_reason = options.failureReason;
    }
    
    // Add any other options
    Object.entries(options).forEach(([key, value]) => {
      if (key !== 'failureReason' && key !== 'completedAt' && value !== undefined) {
        // Convert Date objects to ISO strings
        if (value instanceof Date) {
          updateData[key] = value.toISOString();
        } else {
          updateData[key] = value;
        }
      }
    });
    
    // Update the transaction in the database if we're not using a local transaction ID
    // Local transaction IDs start with "TXN-" instead of being UUIDs
    if (!transactionId.startsWith('TXN-')) {
      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transactionId)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error updating transaction status:', error);
      } else if (data) {
        // Convert database data to Transaction object
        return {
          id: data.id,
          amount: data.amount,
          recipientName: data.recipient_name,
          country: data.country,
          status: data.status as TransactionStatus,
          createdAt: new Date(data.created_at),
          updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
          completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
          failureReason: data.failure_reason,
          // Include other fields
          recipientContact: data.recipient_contact,
          paymentMethod: data.payment_method,
          provider: data.provider,
          estimatedDelivery: data.estimated_delivery,
          totalAmount: data.total_amount
        };
      }
    }
    
    // Try to update in local storage regardless
    const localTransaction = localStorage.getItem(`transaction_${transactionId}`);
    if (localTransaction) {
      const parsedTransaction = JSON.parse(localTransaction);
      const updatedTransaction = {
        ...parsedTransaction,
        status,
        updatedAt: new Date().toISOString(),
        ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {}),
        ...(status === 'failed' && options.failureReason ? { failureReason: options.failureReason } : {})
      };
      
      localStorage.setItem(`transaction_${transactionId}`, JSON.stringify(updatedTransaction));
      console.log('Updated transaction in local storage:', updatedTransaction);
      
      return updatedTransaction as Transaction;
    }
    
    return null;
  } catch (error) {
    console.error('Error in updateTransactionStatus:', error);
    
    // Emergency fallback to local storage
    try {
      const localTransaction = localStorage.getItem(`transaction_${transactionId}`);
      if (localTransaction) {
        const parsedTransaction = JSON.parse(localTransaction);
        const updatedTransaction = {
          ...parsedTransaction,
          status,
          updatedAt: new Date().toISOString(),
          ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {}),
          ...(status === 'failed' && options.failureReason ? { failureReason: options.failureReason } : {})
        };
        
        localStorage.setItem(`transaction_${transactionId}`, JSON.stringify(updatedTransaction));
        console.log('Emergency fallback: Updated in localStorage:', updatedTransaction);
        
        return updatedTransaction as Transaction;
      }
    } catch (e) {
      console.error('Error updating in localStorage:', e);
    }
    
    return null;
  }
};
