
import { getTransactionById as getTransaction, getAllTransactions, getRecentTransactions } from './transaction';
import { Transaction } from '@/types/transaction';

// This file serves as a compatibility layer for legacy code that might still use
// the old transactions service syntax. It redirects all requests to the new transaction service.

/**
 * Get a transaction by ID
 */
export const getTransactionById = async (id: string): Promise<Transaction> => {
  try {
    return await getTransaction(id);
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
