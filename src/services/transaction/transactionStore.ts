
import { Transaction } from "@/types/transaction";
import { mockTransactions } from "@/data/mockTransactions";
import * as api from "../api";
import { Preferences } from "@capacitor/preferences";

const TRANSACTION_STORAGE_KEY = "yumvi_transactions";

// Fallback to mock data when offline or API fails
let offlineTransactions: Transaction[] = [...mockTransactions];
let isInitialized = false;

// Get stored transactions
export const getStoredTransactions = async (): Promise<Transaction[]> => {
  if (!isInitialized) {
    await initializeTransactions();
  }
  return offlineTransactions;
};

// Get offline transactions
export const getOfflineTransactions = (): Transaction[] => {
  return offlineTransactions;
};

// Set offline transactions
export const setOfflineTransactions = async (transactions: Transaction[]): Promise<void> => {
  offlineTransactions = transactions;
  
  // Save to Preferences
  try {
    await Preferences.set({
      key: TRANSACTION_STORAGE_KEY,
      value: JSON.stringify(transactions),
    });
    console.log(`${transactions.length} transactions saved to device storage`);
  } catch (error) {
    console.error('Error saving transactions to storage:', error);
  }
};

// Initialize transactions cache
export const initializeTransactions = async () => {
  if (isInitialized) return;
  
  try {
    // First try to load from Preferences
    const { value } = await Preferences.get({ key: TRANSACTION_STORAGE_KEY });
    
    if (value) {
      // Parse stored transactions and fix dates
      const storedTransactions = JSON.parse(value);
      offlineTransactions = storedTransactions.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
        date: t.date ? new Date(t.date) : undefined,
        estimatedDelivery: t.estimatedDelivery ? new Date(t.estimatedDelivery) : undefined
      }));
      
      console.log(`Loaded ${offlineTransactions.length} transactions from device storage`);
    } else {
      // No stored transactions, try API
      try {
        // Get data from the API using the correct method (get instead of getAll)
        const apiTransactions = await api.get('transactions');
        
        if (apiTransactions && Array.isArray(apiTransactions)) {
          offlineTransactions = apiTransactions;
          
          // Save to preferences for offline use
          await setOfflineTransactions(apiTransactions);
        }
      } catch (apiError) {
        console.error('Could not fetch transactions from API, using mock data:', apiError);
        if (offlineTransactions.length === 0) {
          offlineTransactions = [...mockTransactions];
          
          // Save mock data to preferences
          await setOfflineTransactions(mockTransactions);
        }
      }
    }
  } catch (error) {
    console.error('Error initializing transactions:', error);
    if (offlineTransactions.length === 0) {
      offlineTransactions = [...mockTransactions];
    }
  } finally {
    isInitialized = true;
  }
};

// Add a new transaction to the offline store
export const addOfflineTransaction = async (transaction: Transaction): Promise<void> => {
  const currentTransactions = await getStoredTransactions();
  await setOfflineTransactions([transaction, ...currentTransactions]);
};

// Update an existing transaction in the offline store
export const updateOfflineTransaction = async (
  transactionId: string,
  updatedFields: Partial<Transaction>
): Promise<Transaction | null> => {
  const currentTransactions = await getStoredTransactions();
  const index = currentTransactions.findIndex(t => t.id === transactionId);
  
  if (index === -1) return null;
  
  const updatedTransaction = {
    ...currentTransactions[index],
    ...updatedFields,
    updatedAt: new Date()
  };
  
  currentTransactions[index] = updatedTransaction;
  await setOfflineTransactions(currentTransactions);
  
  return updatedTransaction;
};

// Clear all transactions from the store
export const clearTransactionsStore = async (): Promise<void> => {
  await Preferences.remove({ key: TRANSACTION_STORAGE_KEY });
  offlineTransactions = [...mockTransactions];
  isInitialized = false;
};
