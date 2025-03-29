
import { Transaction } from "@/types/transaction";
import { generateTransactionId } from "@/utils/transactionUtils";
import { addOfflineTransaction } from './storageOperations';

// Create a new transaction with unique ID - renamed for clarity
export const createStoredTransaction = (partial: Partial<Transaction>): Transaction => {
  const id = partial.id || generateTransactionId();
  
  const transaction: Transaction = {
    id,
    amount: partial.amount || '0',
    recipientName: partial.recipientName || 'Unknown Recipient',
    recipientContact: partial.recipientContact || '',
    country: partial.country || 'Unknown',
    status: partial.status || 'pending',
    paymentMethod: partial.paymentMethod || 'unknown',
    provider: partial.provider || 'Unknown',
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDelivery: partial.estimatedDelivery || 'Processing',
    totalAmount: partial.totalAmount || partial.amount || '0',
    ...(partial.completedAt && { completedAt: partial.completedAt }),
    ...(partial.failureReason && { failureReason: partial.failureReason })
  };
  
  addOfflineTransaction(transaction);
  return transaction;
};

// Also export the same function with the original name for backward compatibility
export const createTransaction = createStoredTransaction;
