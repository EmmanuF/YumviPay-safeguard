
import { Transaction } from "@/types/transaction";
import { isOffline } from "@/utils/networkUtils";
import { inMemoryTransactions, generateMockTransactions } from './initialization';

// Get transactions from localStorage or generate mock data if needed
export const getOfflineTransactions = async (): Promise<Transaction[]> => {
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
    return mockTransactions;
  }
};

// Save transactions to localStorage
export const setOfflineTransactions = async (transactions: Transaction[]): Promise<void> => {
  try {
    // Then attempt to save to localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
    // Continue with in-memory storage only
  }
};

// Add a new transaction to storage
export const addOfflineTransaction = async (transaction: Transaction): Promise<void> => {
  try {
    const transactions = await getOfflineTransactions();
    
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
    
    await setOfflineTransactions(transactions);
    console.log(`Transaction ${transaction.id} added/updated in offline storage`);
  } catch (error) {
    console.error(`Error adding transaction ${transaction.id} to offline storage:`, error);
  }
};

// Update an existing transaction in storage
export const updateOfflineTransaction = async (
  transactionId: string, 
  updatedFields: Partial<Transaction>
): Promise<void> => {
  try {
    const transactions = await getOfflineTransactions();
    const existingIndex = transactions.findIndex(t => t.id === transactionId);
    
    if (existingIndex >= 0) {
      transactions[existingIndex] = {
        ...transactions[existingIndex],
        ...updatedFields,
        updatedAt: new Date()
      };
      
      await setOfflineTransactions(transactions);
      console.log(`Transaction ${transactionId} updated in offline storage`);
    } else {
      console.warn(`Cannot update transaction ${transactionId}: not found in storage`);
    }
  } catch (error) {
    console.error(`Error updating transaction ${transactionId} in offline storage:`, error);
  }
};

// Clear all transactions from storage
export const clearTransactionsStore = async (): Promise<void> => {
  try {
    localStorage.removeItem('transactions');
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
