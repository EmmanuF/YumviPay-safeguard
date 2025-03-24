
import { Transaction, TransactionStatus } from "@/types/transaction";
import { isOffline, addPausedRequest } from "@/utils/networkUtils";
import { generateTransactionId } from "@/utils/transactionUtils";

// In-memory storage for transactions when no LocalStorage is available
let inMemoryTransactions: Transaction[] = [];

// Initialize transactions from localStorage or create mock data
export const initializeTransactions = (): Transaction[] => {
  try {
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedTransactions) {
      // Parse stored transactions, ensuring dates are properly converted
      const parsedTransactions = JSON.parse(storedTransactions);
      return parsedTransactions.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        completedAt: t.completedAt ? new Date(t.completedAt) : undefined
      }));
    }
    
    // Generate mock data if nothing in localStorage
    console.log('No transactions found in localStorage, generating mock data');
    const mockTransactions = generateMockTransactions();
    setOfflineTransactions(mockTransactions);
    return mockTransactions;
  } catch (error) {
    console.error('Error initializing transactions:', error);
    
    // Generate mock data if there's an error
    console.log('Error with localStorage, using in-memory mock data');
    const mockTransactions = generateMockTransactions();
    inMemoryTransactions = mockTransactions;
    return mockTransactions;
  }
};

// Generate mock transactions for testing
export const generateMockTransactions = (): Transaction[] => {
  return [
    {
      id: 'YM1RD5TA',
      amount: '150.00',
      recipientName: 'John Doe',
      recipientContact: '+237 650123456',
      country: 'CM',
      status: 'completed',
      paymentMethod: 'mobile_money',
      provider: 'MTN Mobile Money',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      estimatedDelivery: 'Delivered',
      totalAmount: '150.00'
    },
    {
      id: 'YM2RD5TB',
      amount: '75.50',
      recipientName: 'Jane Smith',
      recipientContact: '+237 677654321',
      country: 'CM',
      status: 'processing',
      paymentMethod: 'bank_transfer',
      provider: 'Ecobank',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      estimatedDelivery: '1-2 business days',
      totalAmount: '75.50'
    },
    {
      id: 'YM3RD5TC',
      amount: '200.00',
      recipientName: 'Robert Johnson',
      recipientContact: '+237 699887766',
      country: 'CM',
      status: 'failed',
      paymentMethod: 'mobile_money',
      provider: 'Orange Money',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      estimatedDelivery: 'Failed',
      failureReason: 'Insufficient funds',
      totalAmount: '200.00'
    }
  ];
};

// Get transactions from localStorage or generate mock data if needed
export const getOfflineTransactions = (): Transaction[] => {
  try {
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedTransactions) {
      // Parse stored transactions, ensuring dates are properly converted
      const parsedTransactions = JSON.parse(storedTransactions);
      return parsedTransactions.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        completedAt: t.completedAt ? new Date(t.completedAt) : undefined
      }));
    }
    
    // If nothing in localStorage but we have in-memory data, use that
    if (inMemoryTransactions.length > 0) {
      return inMemoryTransactions;
    }
    
    // Generate mock data if nothing in localStorage or in-memory
    console.log('No transactions found, generating mock data');
    const mockTransactions = generateMockTransactions();
    inMemoryTransactions = mockTransactions;
    return mockTransactions;
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    
    // If there's an error, return in-memory data if available
    if (inMemoryTransactions.length > 0) {
      return inMemoryTransactions;
    }
    
    // Last resort: generate new mock data
    console.log('Error with localStorage, generating new mock data');
    const mockTransactions = generateMockTransactions();
    inMemoryTransactions = mockTransactions;
    return mockTransactions;
  }
};

// Save transactions to localStorage
export const setOfflineTransactions = (transactions: Transaction[]): void => {
  try {
    // First update in-memory storage
    inMemoryTransactions = transactions;
    
    // Then attempt to save to localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
    // Continue with in-memory storage only
  }
};

// Add a new transaction to storage
export const addOfflineTransaction = (transaction: Transaction): void => {
  try {
    const transactions = getOfflineTransactions();
    
    // Check if transaction already exists
    const existingIndex = transactions.findIndex(t => t.id === transaction.id);
    
    if (existingIndex >= 0) {
      // Update existing transaction
      transactions[existingIndex] = {
        ...transactions[existingIndex],
        ...transaction,
        updatedAt: new Date()
      };
    } else {
      // Add new transaction
      transactions.push(transaction);
    }
    
    setOfflineTransactions(transactions);
    console.log(`Transaction ${transaction.id} added/updated in offline storage`);
  } catch (error) {
    console.error(`Error adding transaction ${transaction.id} to offline storage:`, error);
  }
};

// Update an existing transaction in storage
export const updateOfflineTransaction = (
  transactionId: string, 
  updatedFields: Partial<Transaction>
): void => {
  try {
    const transactions = getOfflineTransactions();
    const existingIndex = transactions.findIndex(t => t.id === transactionId);
    
    if (existingIndex >= 0) {
      transactions[existingIndex] = {
        ...transactions[existingIndex],
        ...updatedFields,
        updatedAt: new Date()
      };
      
      setOfflineTransactions(transactions);
      console.log(`Transaction ${transactionId} updated in offline storage`);
    } else {
      console.warn(`Cannot update transaction ${transactionId}: not found in storage`);
    }
  } catch (error) {
    console.error(`Error updating transaction ${transactionId} in offline storage:`, error);
  }
};

// Clear all transactions from storage
export const clearTransactionsStore = (): void => {
  try {
    localStorage.removeItem('transactions');
    inMemoryTransactions = [];
    console.log('Transactions store cleared');
  } catch (error) {
    console.error('Error clearing transactions store:', error);
  }
};

// Get all stored transactions
export const getStoredTransactions = async (): Promise<Transaction[]> => {
  if (isOffline()) {
    return getOfflineTransactions();
  }
  
  try {
    // In a real app, this would fetch from Supabase
    // For now, we'll just use localStorage directly
    return getOfflineTransactions();
  } catch (error) {
    console.error('Error retrieving stored transactions:', error);
    return getOfflineTransactions(); // Fall back to offline data
  }
};

// Create a new transaction with unique ID
export const createTransaction = (partial: Partial<Transaction>): Transaction => {
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
