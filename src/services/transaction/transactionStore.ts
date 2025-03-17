
import { Transaction } from "@/types/transaction";
import { mockTransactions } from "@/data/mockTransactions";
import * as api from "../api";

// Fallback to mock data when offline or API fails
let offlineTransactions: Transaction[] = [...mockTransactions];

// Get stored transactions
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
  try {
    // Get data from the API using the refactored structure
    const apiTransactions = await api.getAll('transactions');
    offlineTransactions = apiTransactions;
  } catch (error) {
    console.error('Could not initialize transactions from API, using mock data:', error);
    if (offlineTransactions.length === 0) {
      offlineTransactions = [...mockTransactions];
    }
  }
};
