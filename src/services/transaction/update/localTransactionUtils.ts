
import { Transaction, TransactionStatus } from "@/types/transaction";

/**
 * Get a transaction from local storage
 */
export const getLocalTransaction = (transactionId: string): Transaction | null => {
  try {
    const data = localStorage.getItem(`transaction_${transactionId}`);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    
    // Ensure dates are Date objects
    return {
      ...parsed,
      createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
      updatedAt: parsed.updatedAt ? new Date(parsed.updatedAt) : undefined,
      completedAt: parsed.completedAt ? new Date(parsed.completedAt) : undefined
    };
  } catch (error) {
    console.error(`Error getting local transaction ${transactionId}:`, error);
    return null;
  }
};

/**
 * Update a transaction in local storage
 */
export const updateLocalTransaction = async (
  transactionId: string,
  status: TransactionStatus,
  options?: {
    completedAt?: Date;
    failureReason?: string;
    [key: string]: any;
  }
): Promise<Transaction | null> => {
  try {
    const transaction = getLocalTransaction(transactionId);
    if (!transaction) {
      console.error(`No local transaction found for ${transactionId}`);
      return null;
    }
    
    // Update the transaction
    const updatedTransaction: Transaction = {
      ...transaction,
      status,
      updatedAt: new Date(),
      ...(status === 'completed' && options?.completedAt ? { completedAt: options.completedAt } : {}),
      ...(status === 'failed' && options?.failureReason ? { failureReason: options.failureReason } : {})
    };
    
    // Add any additional properties from options
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (key !== 'completedAt' && key !== 'failureReason' && value !== undefined) {
          (updatedTransaction as any)[key] = value;
        }
      });
    }
    
    // Save the updated transaction
    localStorage.setItem(
      `transaction_${transactionId}`, 
      JSON.stringify(updatedTransaction)
    );
    
    // Create a backup
    localStorage.setItem(
      `transaction_backup_${transactionId}`, 
      JSON.stringify(updatedTransaction)
    );
    
    console.log(`Local transaction ${transactionId} updated to ${status}`);
    return updatedTransaction;
  } catch (error) {
    console.error(`Error updating local transaction ${transactionId}:`, error);
    return null;
  }
};
