// Fix async/Promise issues with the transaction retrieval service
import { Transaction } from "@/types/transaction";
import { getStoredTransactions } from "./transactionStore";
import { toast } from 'sonner';

// Improved direct localStorage check function
const getTransactionFromLocalStorage = (id: string): Transaction | null => {
  try {
    console.log(`Checking localStorage directly for transaction: ${id}`);
    // First try exact match with transaction ID
    let rawData = localStorage.getItem(`transaction_${id}`);
    
    // If not found, try searching all localStorage keys
    if (!rawData) {
      console.log(`No direct match for transaction_${id}, searching all localStorage keys`);
      // Get all keys that might be related to this transaction
      const allKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('transaction_') || key.includes(id)
      );
      
      console.log(`Found ${allKeys.length} potential transaction keys:`, allKeys);
      
      // Try each key
      for (const key of allKeys) {
        const tempData = localStorage.getItem(key);
        if (tempData) {
          try {
            const parsed = JSON.parse(tempData);
            // Check if this data matches our transaction ID
            if (
              parsed.id === id || 
              parsed.transactionId === id || 
              key === `transaction_${id}`
            ) {
              console.log(`Found matching transaction in key: ${key}`, parsed);
              rawData = tempData;
              break;
            }
          } catch (e) {
            console.error(`Error parsing data from key ${key}:`, e);
          }
        }
      }
    }
    
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        console.log(`Successfully parsed transaction data from localStorage:`, parsed);
        
        // Convert the data to a proper Transaction object
        return {
          id: parsed.id || parsed.transactionId || id,
          amount: parsed.amount || '0',
          recipientName: parsed.recipientName || 'Unknown',
          recipientContact: parsed.recipientContact || '',
          country: parsed.country || 'Unknown',
          status: parsed.status || 'pending',
          createdAt: new Date(parsed.createdAt || Date.now()),
          updatedAt: new Date(parsed.updatedAt || Date.now()),
          completedAt: parsed.completedAt ? new Date(parsed.completedAt) : undefined,
          estimatedDelivery: parsed.estimatedDelivery || 'Processing',
          totalAmount: parsed.totalAmount || parsed.amount || '0',
          provider: parsed.provider || 'Unknown',
          paymentMethod: parsed.paymentMethod || 'unknown',
          failureReason: parsed.failureReason
        };
      } catch (parseError) {
        console.error(`Error parsing transaction data:`, parseError);
        return null;
      }
    }
    
    console.log(`No transaction data found in localStorage for ID: ${id}`);
    return null;
  } catch (error) {
    console.error(`Error checking localStorage for transaction ${id}:`, error);
    return null;
  }
};

// Get transaction by ID - improved with better localStorage checking
export const getTransactionById = async (id: string): Promise<Transaction> => {
  console.log(`getTransactionById called for ID: ${id}`);
  
  try {
    // First, check localStorage directly (prioritize this)
    const localStorageTransaction = getTransactionFromLocalStorage(id);
    if (localStorageTransaction) {
      console.log(`Found transaction in localStorage:`, localStorageTransaction);
      return localStorageTransaction;
    }
    
    // If not in localStorage, check stored transactions
    const transactions = await getStoredTransactions();
    console.log(`Retrieved ${transactions.length} transactions from storage`);
    
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
      console.warn(`Transaction with ID ${id} not found, creating fallback transaction`);
      
      // If we still can't find the transaction, create a fallback one to avoid errors
      return {
        id: id,
        amount: '0',
        recipientName: 'Processing...',
        recipientContact: '',
        country: 'Unknown',
        status: 'processing' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedDelivery: 'Processing',
        totalAmount: '0',
        provider: 'Unknown',
        paymentMethod: 'unknown'
      };
    }
    
    console.log(`Found transaction for ID ${id}:`, transaction);
    return transaction;
  } catch (error) {
    console.error(`Error retrieving transaction ${id}:`, error);
    
    // Display a toast for user feedback
    toast.error("Transaction Error", {
      description: `Could not retrieve transaction details. Please try again.`,
    });
    
    // Return a fallback transaction with error state
    return {
      id: id,
      amount: '0',
      recipientName: 'Error retrieving transaction',
      recipientContact: '',
      country: 'Unknown',
      status: 'failed' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDelivery: 'Error',
      failureReason: error instanceof Error ? error.message : 'Unknown error',
      totalAmount: '0',
      provider: 'Unknown',
      paymentMethod: 'unknown'
    };
  }
};

// Get all transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    return await getStoredTransactions();
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return []; // Return empty array instead of throwing
  }
};

// Get recent transactions (last 5)
export const getRecentTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactions = await getStoredTransactions();
    return transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  } catch (error) {
    console.error("Error retrieving recent transactions:", error);
    // Return empty array instead of throwing to prevent UI failures
    return [];
  }
};

// Get transaction (alias for getTransactionById for compatibility)
export const getTransaction = async (id: string): Promise<Transaction> => {
  return getTransactionById(id);
};

// Get all transactions (alias for getTransactions for compatibility)
export const getAllTransactions = async (): Promise<Transaction[]> => {
  return getTransactions();
};
