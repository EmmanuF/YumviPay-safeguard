
import { supabase } from '@/integrations/supabase/client';
import type { Transaction, TransactionStatus } from '@/types/transaction';
import { completeFallbackTransaction } from './utils/fallbackTransactions';

interface TransactionUpdateOptions {
  failureReason?: string;
  completedAt?: Date;
  [key: string]: any;
}

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
  options: TransactionUpdateOptions = {}
): Promise<Transaction | null> => {
  try {
    console.log(`Updating transaction ${transactionId} to status: ${status}`, options);
    
    // For TXN-prefixed transactions, update locally
    if (transactionId.startsWith('TXN-')) {
      console.log(`Local transaction ID detected: ${transactionId}`);
      
      // Handle completed status specifically for local transactions
      if (status === 'completed') {
        const completedTransaction = completeFallbackTransaction(transactionId);
        return completedTransaction;
      }
      
      // Handle other status updates for local transactions
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
        localStorage.setItem(`transaction_backup_${transactionId}`, JSON.stringify(updatedTransaction));
        
        console.log('Updated local transaction in localStorage:', updatedTransaction);
        
        return {
          ...updatedTransaction,
          createdAt: new Date(updatedTransaction.createdAt),
          updatedAt: new Date(),
          completedAt: status === 'completed' ? new Date() : undefined
        };
      }
      
      return null;
    }
    
    // Prepare the update data for Supabase
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
    
    // Update the transaction in the database
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating transaction status:', error);
      
      // Try to update in local storage as a fallback
      const localTransaction = localStorage.getItem(`transaction_${transactionId}`);
      if (localTransaction) {
        const parsedTransaction = JSON.parse(localTransaction);
        const updatedTransaction = {
          ...parsedTransaction,
          status,
          updatedAt: new Date().toISOString(),
          ...updateData
        };
        
        localStorage.setItem(`transaction_${transactionId}`, JSON.stringify(updatedTransaction));
        console.log('Updated transaction in local storage:', updatedTransaction);
        
        return updatedTransaction as Transaction;
      }
      
      return null;
    }
    
    console.log('Transaction status updated successfully:', data);
    
    // Convert database response to Transaction type
    const updatedTransaction: Transaction = {
      id: data.id,
      amount: data.amount,
      recipientName: data.recipient_name,
      country: data.country,
      status: data.status as TransactionStatus,
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      failureReason: data.failure_reason,
      recipientContact: data.recipient_contact,
      paymentMethod: data.payment_method,
      provider: data.provider,
      estimatedDelivery: data.estimated_delivery,
      totalAmount: data.total_amount
    };
    
    return updatedTransaction;
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

/**
 * Simulate a webhook response for a transaction (for testing)
 * @param transactionId Transaction ID
 * @param status Status to set (defaults to random success/failure)
 */
export const simulateWebhook = async (
  transactionId: string
): Promise<void> => {
  try {
    // Randomly set to completed or failed if no status is provided
    const finalStatus = Math.random() > 0.3 ? 'completed' : 'failed';
    
    console.log(`📥 Processing Kado webhook: ${JSON.stringify({
      transaction_id: transactionId,
      status: finalStatus,
      amount: "100",
      fee: "1.50",
      provider: "Afriland First Bank",
      payment_method: "mobile_money",
      timestamp: new Date().toISOString(),
      metadata: {
        simulation: true,
        originalData: null
      }
    }, null, 2)}`);
    
    // Update the transaction status
    if (finalStatus === 'completed') {
      await updateTransactionStatus(transactionId, 'completed', {
        completedAt: new Date()
      });
    } else {
      const failureReasons = [
        'Insufficient funds',
        'Recipient account not found',
        'Transaction limit exceeded',
        'Network error',
        'Service temporarily unavailable'
      ];
      
      const randomReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
      
      await updateTransactionStatus(transactionId, 'failed', {
        failureReason: randomReason
      });
    }
    
    console.log(`✅ Transaction ${transactionId} updated with status: ${finalStatus}`);
    console.log(`✅ Webhook simulation completed`);
  } catch (error) {
    console.error('Error simulating webhook:', error);
  }
};

export default {
  updateTransactionStatus,
  simulateWebhook
};
