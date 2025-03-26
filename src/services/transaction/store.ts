
/**
 * Transaction store for managing transaction data
 */
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionStatus } from '@/types/transaction';

// Local storage keys
const TRANSACTIONS_STORE_KEY = 'transactions_store';
const OFFLINE_TRANSACTIONS_KEY = 'offline_transactions';

// Initialize the transaction store
export const initializeTransactions = (): void => {
  if (!localStorage.getItem(TRANSACTIONS_STORE_KEY)) {
    localStorage.setItem(TRANSACTIONS_STORE_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(OFFLINE_TRANSACTIONS_KEY)) {
    localStorage.setItem(OFFLINE_TRANSACTIONS_KEY, JSON.stringify([]));
  }
};

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
const storeTransactions = async (transactions: Transaction[]): Promise<void> => {
  localStorage.setItem(TRANSACTIONS_STORE_KEY, JSON.stringify(transactions));
};

// Create a new transaction
export const createTransaction = async (transactionData: Partial<Transaction>): Promise<Transaction> => {
  console.log('Creating transaction with data:', transactionData);
  
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
  
  console.log('Finalized transaction object:', transaction);
  
  // Save transaction to local storage
  const transactions = await getStoredTransactions();
  transactions.push(transaction);
  await storeTransactions(transactions);
  
  // Save a specific copy for this transaction ID for direct access
  localStorage.setItem(`transaction_${transaction.id}`, JSON.stringify(transaction));
  
  return transaction;
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

// Generate mock transactions for testing
export const generateMockTransactions = async (): Promise<Transaction[]> => {
  const mockTransactions: Transaction[] = [
    {
      id: uuidv4(),
      amount: '100.00',
      recipientName: 'John Doe',
      country: 'CM',
      status: 'completed',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      recipientContact: '+237612345678',
      paymentMethod: 'mobile_money',
      provider: 'MTN Mobile Money',
      estimatedDelivery: 'Delivered'
    },
    {
      id: uuidv4(),
      amount: '75.50',
      recipientName: 'Jane Smith',
      country: 'CM',
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      recipientContact: '+237687654321',
      paymentMethod: 'mobile_money',
      provider: 'Orange Money',
      estimatedDelivery: '15 minutes'
    },
    {
      id: uuidv4(),
      amount: '50.25',
      recipientName: 'Robert Johnson',
      country: 'CM',
      status: 'failed',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      recipientContact: '+237698765432',
      paymentMethod: 'bank_transfer',
      provider: 'Ecobank',
      failureReason: 'Insufficient funds',
      estimatedDelivery: 'Failed'
    }
  ];
  
  await storeTransactions(mockTransactions);
  return mockTransactions;
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
  
  initializeTransactions();
};
