
import { Transaction, TransactionStatus } from "@/types/transaction";
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new transaction in the local store
 */
export const createTransaction = async (transactionData: Partial<Transaction>): Promise<Transaction> => {
  console.log('Creating transaction in store with data:', transactionData);
  
  const transaction: Transaction = {
    id: transactionData.id || uuidv4(),
    amount: transactionData.amount || '0',
    recipientName: transactionData.recipientName || 'Unknown',
    country: transactionData.country || 'Unknown',
    status: transactionData.status as TransactionStatus || 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    // Include other fields from transactionData
    ...transactionData
  };
  
  console.log('Finalized transaction object for store:', transaction);
  
  // Save a specific copy for this transaction ID for direct access
  localStorage.setItem(`transaction_${transaction.id}`, JSON.stringify(transaction));
  
  return transaction;
};

/**
 * Alias for createTransaction (for backward compatibility)
 */
export const createStoredTransaction = createTransaction;
