
import { Transaction } from "@/types/transaction";
import { supabase } from "@/integrations/supabase/client";
import { apiRequest } from "@/services/api/handlers";
import { isOffline, addPausedRequest } from "@/utils/networkUtils";

// In-memory cache of transactions
let transactionsCache: Transaction[] | null = null;

// Initialize transactions from storage
export const initializeTransactions = async (): Promise<void> => {
  // If already initialized, do nothing
  if (transactionsCache !== null) {
    console.log('Transactions already initialized');
    return;
  }
  
  try {
    console.log('Initializing transactions...');
    
    // Try to get transactions from API
    try {
      const response = await apiRequest<{ transactions: Transaction[] }>('/api/transactions', {
        timeout: 5000, // Short timeout since this is initialization
        retry: true,
        maxRetries: 2,
        cacheable: true
      });
      
      if (response && response.transactions) {
        console.log(`Retrieved ${response.transactions.length} transactions from API`);
        transactionsCache = response.transactions;
        return;
      }
    } catch (error) {
      console.error('Could not fetch transactions from API, using mock data:', error);
    }
    
    // Fallback to local storage
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      try {
        const parsed = JSON.parse(storedTransactions);
        if (Array.isArray(parsed)) {
          console.log(`Retrieved ${parsed.length} transactions from localStorage`);
          transactionsCache = parsed;
          return;
        }
      } catch (e) {
        console.error('Error parsing stored transactions:', e);
      }
    }
    
    console.log('No stored transactions found, initializing with mock data');
    // Initialize with example mock data
    transactionsCache = getMockTransactions();
    
    // Store the mock data in localStorage for future use
    localStorage.setItem('transactions', JSON.stringify(transactionsCache));
    
  } catch (error) {
    console.error('Error initializing transactions:', error);
    // Ensure we at least have empty array to prevent errors
    transactionsCache = [];
  }
};

// Get transactions from storage
export const getStoredTransactions = async (): Promise<Transaction[]> => {
  // Initialize if needed
  if (transactionsCache === null) {
    await initializeTransactions();
  }
  
  // Ensure we have a valid array
  return transactionsCache || [];
};

// Get transactions available offline (from localStorage)
export const getOfflineTransactions = (): Transaction[] => {
  try {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      const parsed = JSON.parse(storedTransactions);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error accessing offline transactions:', e);
  }
  
  return [];
};

// Set transactions in offline storage
export const setOfflineTransactions = (transactions: Transaction[]): void => {
  try {
    // Update both cache and localStorage
    transactionsCache = transactions;
    localStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (e) {
    console.error('Error setting offline transactions:', e);
  }
};

// Add a transaction to offline storage
export const addOfflineTransaction = (transaction: Transaction): void => {
  const transactions = getOfflineTransactions();
  
  // Check if the transaction already exists
  const existingIndex = transactions.findIndex(t => t.id === transaction.id);
  if (existingIndex >= 0) {
    // Update existing transaction
    transactions[existingIndex] = {...transaction};
  } else {
    // Add new transaction
    transactions.push(transaction);
  }
  
  setOfflineTransactions(transactions);
  console.log(`Transaction ${transaction.id} added/updated in offline storage`);
};

// Update a transaction in offline storage
export const updateOfflineTransaction = (transaction: Transaction): void => {
  const transactions = getOfflineTransactions();
  const index = transactions.findIndex(t => t.id === transaction.id);
  
  if (index >= 0) {
    transactions[index] = transaction;
    setOfflineTransactions(transactions);
    console.log(`Transaction ${transaction.id} updated in offline storage`);
  } else {
    // If not found, add it
    addOfflineTransaction(transaction);
  }
};

// Clear the transactions store
export const clearTransactionsStore = (): void => {
  transactionsCache = null;
  localStorage.removeItem('transactions');
};

// Helper function to generate mock transactions
const getMockTransactions = (): Transaction[] => {
  // Generate a transaction with the ID from the URL if possible
  const currentPath = window.location.pathname;
  const transactionIdMatch = currentPath.match(/\/transaction\/([A-Z0-9-]+)/i);
  const currentTransactionId = transactionIdMatch ? transactionIdMatch[1] : null;
  
  console.log(`Current transaction ID from URL: ${currentTransactionId || 'none'}`);
  
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check also for pending transaction data in localStorage
  let pendingTransactionData = null;
  if (currentTransactionId) {
    try {
      const storedTxData = localStorage.getItem(`transaction_${currentTransactionId}`);
      if (storedTxData) {
        pendingTransactionData = JSON.parse(storedTxData);
        console.log(`Found pending transaction data for ${currentTransactionId}:`, pendingTransactionData);
      }
    } catch (e) {
      console.error(`Error parsing pending transaction data for ${currentTransactionId}:`, e);
    }
  }
  
  // Generate some mock transactions
  const mockTransactions: Transaction[] = [
    {
      id: 'TRX12345',
      amount: '100.00',
      currency: 'USD',
      fee: '0.00',
      recipientId: 'RCP123',
      recipientName: 'John Doe',
      recipientContact: '+237612345678',
      recipientCountry: 'Cameroon',
      recipientCountryCode: 'CM',
      paymentMethod: 'mobile_money',
      provider: 'MTN Mobile Money',
      country: 'Cameroon',
      status: 'completed',
      createdAt: yesterday,
      updatedAt: yesterday,
      completedAt: yesterday,
      estimatedDelivery: 'Delivered',
      totalAmount: '100.00',
      date: yesterday.toISOString().split('T')[0]
    },
    {
      id: 'TRX67890',
      amount: '50.00',
      currency: 'USD',
      fee: '0.00',
      recipientId: 'RCP456',
      recipientName: 'Jane Smith',
      recipientContact: '+237623456789',
      recipientCountry: 'Cameroon',
      recipientCountryCode: 'CM',
      paymentMethod: 'mobile_money',
      provider: 'Orange Money',
      country: 'Cameroon',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      estimatedDelivery: '5-15 minutes',
      totalAmount: '50.00',
      date: now.toISOString().split('T')[0]
    }
  ];
  
  // If we have a transaction ID from the URL, add it as a mock transaction
  if (currentTransactionId) {
    console.log(`Adding mock transaction for current ID: ${currentTransactionId}`);
    
    // Use any pending transaction data if available
    if (pendingTransactionData) {
      mockTransactions.push({
        id: currentTransactionId,
        amount: pendingTransactionData.amount || '75.00',
        currency: pendingTransactionData.sourceCurrency || 'USD',
        fee: '0.00',
        recipientId: 'RCP789',
        recipientName: pendingTransactionData.recipientName || 'William Johnson',
        recipientContact: pendingTransactionData.recipientContact || '+237634567890',
        recipientCountry: pendingTransactionData.country || 'Cameroon',
        recipientCountryCode: pendingTransactionData.countryCode || 'CM',
        paymentMethod: pendingTransactionData.paymentMethod || 'mobile_money',
        provider: pendingTransactionData.selectedProvider || 'MTN Mobile Money',
        country: pendingTransactionData.country || 'Cameroon',
        status: pendingTransactionData.status || 'processing',
        createdAt: pendingTransactionData.createdAt ? new Date(pendingTransactionData.createdAt) : now,
        updatedAt: now,
        estimatedDelivery: '1-5 minutes',
        totalAmount: pendingTransactionData.amount || '75.00',
        date: now.toISOString().split('T')[0]
      });
    } else {
      // Just create a generic mock transaction with the current ID
      mockTransactions.push({
        id: currentTransactionId,
        amount: '75.00',
        currency: 'USD',
        fee: '0.00',
        recipientId: 'RCP789',
        recipientName: 'William Johnson',
        recipientContact: '+237634567890',
        recipientCountry: 'Cameroon',
        recipientCountryCode: 'CM',
        paymentMethod: 'mobile_money',
        provider: 'MTN Mobile Money',
        country: 'Cameroon',
        status: 'processing',
        createdAt: now,
        updatedAt: now,
        estimatedDelivery: '1-5 minutes',
        totalAmount: '75.00',
        date: now.toISOString().split('T')[0]
      });
    }
  }
  
  return mockTransactions;
};
