
import { Transaction } from "@/types/transaction";
import { mockTransactions } from "@/data/mockTransactions";

// Fallback to mock data when offline or API fails
let offlineTransactions: Transaction[] = [...mockTransactions];

// Get stored transactions (this function was missing)
export const getStoredTransactions = (): Transaction[] => {
  return offlineTransactions;
};

// Get offline transactions
export const getOfflineTransactions = (): Transaction[] => {
  return offlineTransactions;
};

// Set offline transactions
export const setOfflineTransactions = (transactions: Transaction[]): void => {
  offlineTransactions = transactions;
};

// Initialize transactions cache
export const initializeTransactions = async () => {
  const { apiService } = await import("../apiService");
  
  // Try to load from API first
  try {
    const apiTransactions = await apiService.transactions.getAll();
    offlineTransactions = apiTransactions;
  } catch (error) {
    console.error('Could not initialize transactions from API, using mock data:', error);
    if (offlineTransactions.length === 0) {
      offlineTransactions = [...mockTransactions];
    }
  }
};
