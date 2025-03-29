
import { Transaction } from '@/types/transaction';

// Local storage keys
const TRANSACTIONS_STORE_KEY = 'transactions_store';
const OFFLINE_TRANSACTIONS_KEY = 'offline_transactions';

// Get stored transactions
export const getStoredTransactions = async (): Promise<Transaction[]> => {
  const storedData = localStorage.getItem(TRANSACTIONS_STORE_KEY);
  if (!storedData) {
    return [];
  }
  
  try {
    return JSON.parse(storedData).map((transaction: any) => ({
      ...transaction,
      createdAt: new Date(transaction.createdAt),
      updatedAt: transaction.updatedAt ? new Date(transaction.updatedAt) : undefined,
      completedAt: transaction.completedAt ? new Date(transaction.completedAt) : undefined
    }));
  } catch (error) {
    console.error('Error parsing stored transactions:', error);
    return [];
  }
};

// Store transactions
export const storeTransactions = async (transactions: Transaction[]): Promise<void> => {
  localStorage.setItem(TRANSACTIONS_STORE_KEY, JSON.stringify(transactions));
};

// Get offline transactions
export const getOfflineTransactions = async (): Promise<Transaction[]> => {
  const storedData = localStorage.getItem(OFFLINE_TRANSACTIONS_KEY);
  if (!storedData) {
    return [];
  }
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Error parsing offline transactions:', error);
    return [];
  }
};

// Store offline transactions
export const setOfflineTransactions = async (transactions: Transaction[]): Promise<void> => {
  localStorage.setItem(OFFLINE_TRANSACTIONS_KEY, JSON.stringify(transactions));
};

// Add an offline transaction
export const addOfflineTransaction = async (transaction: Transaction): Promise<void> => {
  const offlineTransactions = await getOfflineTransactions();
  offlineTransactions.push(transaction);
  await setOfflineTransactions(offlineTransactions);
};

// Update an offline transaction
export const updateOfflineTransaction = async (id: string, updates: Partial<Transaction>): Promise<void> => {
  // Update in the main transactions store
  const transactions = await getStoredTransactions();
  const transactionIndex = transactions.findIndex(tx => tx.id === id);
  
  if (transactionIndex !== -1) {
    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      ...updates,
      updatedAt: new Date()
    };
    await storeTransactions(transactions);
  }
  
  // Also update in the direct access storage
  const storedTransaction = localStorage.getItem(`transaction_${id}`);
  if (storedTransaction) {
    try {
      const transaction = JSON.parse(storedTransaction);
      const updatedTransaction = {
        ...transaction,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`transaction_${id}`, JSON.stringify(updatedTransaction));
    } catch (error) {
      console.error(`Error updating transaction ${id}:`, error);
    }
  }
  
  // Update in offline transactions if present
  const offlineTransactions = await getOfflineTransactions();
  const offlineTransactionIndex = offlineTransactions.findIndex(tx => tx.id === id);
  
  if (offlineTransactionIndex !== -1) {
    offlineTransactions[offlineTransactionIndex] = {
      ...offlineTransactions[offlineTransactionIndex],
      ...updates,
      updatedAt: new Date()
    };
    await setOfflineTransactions(offlineTransactions);
  }
};

// Clear the transaction store (for testing)
export const clearTransactionsStore = async (): Promise<void> => {
  localStorage.removeItem(TRANSACTIONS_STORE_KEY);
  localStorage.removeItem(OFFLINE_TRANSACTIONS_KEY);
  
  // Clear any direct access transaction items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('transaction_')) {
      localStorage.removeItem(key);
    }
  }
  
  // Reinitialize empty stores
  localStorage.setItem(TRANSACTIONS_STORE_KEY, JSON.stringify([]));
  localStorage.setItem(OFFLINE_TRANSACTIONS_KEY, JSON.stringify([]));
};
