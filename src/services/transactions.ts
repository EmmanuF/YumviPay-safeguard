
import { Transaction } from '@/types/transaction';
import { 
  getTransactionById as getTransaction, 
  getAllTransactions, 
  getRecentTransactions 
} from '@/services/transaction';

// Export the Transaction type for backwards compatibility
export type { Transaction };

// This file serves as a compatibility layer for legacy code that might still use
// the old transactions service syntax. It redirects all requests to the new transaction service.

/**
 * Get a transaction by ID
 */
export const getTransactionById = async (id: string): Promise<Transaction> => {
  try {
    const transaction = await getTransaction(id);
    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    return transaction;
  } catch (error) {
    console.error(`Error retrieving transaction ${id}:`, error);
    throw error;
  }
};

/**
 * Get all transactions
 */
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    return await getAllTransactions();
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    throw error;
  }
};

/**
 * Get recent transactions
 */
export const getRecentTransactionsLegacy = async (): Promise<Transaction[]> => {
  try {
    return await getRecentTransactions();
  } catch (error) {
    console.error('Error retrieving recent transactions:', error);
    throw error;
  }
};
