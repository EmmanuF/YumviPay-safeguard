
/**
 * Transaction Data Store
 * 
 * A centralized manager for transaction data across the application.
 * Provides a single source of truth for transaction information through
 * the entire user flow, solving inconsistency issues.
 */

// Define the core transaction data interface
export interface TransactionDataStore {
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  convertedAmount: number;
  recipientName?: string;
  recipientContact?: string;
  recipientCountry?: string;
  paymentMethod?: string;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Keys used for storage
const STORE_KEY = 'TRANSACTION_DATA_STORE';
const STORE_BACKUP_KEY = 'TRANSACTION_DATA_STORE_BACKUP';
const AMOUNT_KEY = 'TRANSACTION_AMOUNT';

// Default transaction data
const DEFAULT_DATA: TransactionDataStore = {
  amount: 0,
  sourceCurrency: 'USD',
  targetCurrency: 'XAF',
  exchangeRate: 610,
  convertedAmount: 0,
  createdAt: new Date(),
  updatedAt: new Date()
};

/**
 * Initialize the transaction data store with default values if not already present
 */
export const initializeStore = (): TransactionDataStore => {
  const existingData = getTransactionData();
  if (existingData && existingData.amount > 0) {
    return existingData;
  }
  
  setTransactionData(DEFAULT_DATA);
  return DEFAULT_DATA;
};

/**
 * Get transaction data from storage
 */
export const getTransactionData = (): TransactionDataStore | null => {
  try {
    // Try primary store first
    const storedData = localStorage.getItem(STORE_KEY);
    if (storedData) {
      const data = JSON.parse(storedData);
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      };
    }
    
    // Try backup store
    const backupData = localStorage.getItem(STORE_BACKUP_KEY);
    if (backupData) {
      const data = JSON.parse(backupData);
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      };
    }
    
    // No data found
    return null;
  } catch (error) {
    console.error('Error retrieving transaction data:', error);
    return null;
  }
};

/**
 * Set transaction data in storage
 */
export const setTransactionData = (data: Partial<TransactionDataStore>): void => {
  try {
    // Get existing data or use default
    const existingData = getTransactionData() || DEFAULT_DATA;
    
    // Create updated data
    const updatedData: TransactionDataStore = {
      ...existingData,
      ...data,
      updatedAt: new Date()
    };
    
    // Ensure converted amount is calculated
    if (data.amount !== undefined || data.exchangeRate !== undefined) {
      const amount = data.amount !== undefined ? data.amount : existingData.amount;
      const exchangeRate = data.exchangeRate !== undefined ? data.exchangeRate : existingData.exchangeRate;
      updatedData.convertedAmount = amount * exchangeRate;
    }
    
    // Store in multiple locations for redundancy
    localStorage.setItem(STORE_KEY, JSON.stringify(updatedData));
    localStorage.setItem(STORE_BACKUP_KEY, JSON.stringify(updatedData));
    
    // Store amount separately for easy access
    localStorage.setItem(AMOUNT_KEY, updatedData.amount.toString());
    
    console.log('Transaction data updated:', updatedData);
  } catch (error) {
    console.error('Error saving transaction data:', error);
  }
};

/**
 * Get the current transaction amount
 */
export const getTransactionAmount = (): number => {
  try {
    // Try direct amount first
    const amountStr = localStorage.getItem(AMOUNT_KEY);
    if (amountStr && !isNaN(parseFloat(amountStr))) {
      return parseFloat(amountStr);
    }
    
    // Try full transaction data
    const data = getTransactionData();
    if (data && data.amount) {
      return data.amount;
    }
    
    return 0;
  } catch (error) {
    console.error('Error retrieving transaction amount:', error);
    return 0;
  }
};

/**
 * Set just the transaction amount
 */
export const setTransactionAmount = (amount: number): void => {
  if (isNaN(amount) || amount <= 0) {
    console.error('Invalid amount:', amount);
    return;
  }
  
  // Store in multiple places for redundancy
  localStorage.setItem(AMOUNT_KEY, amount.toString());
  
  // Update the full store
  setTransactionData({ amount });
};

/**
 * Clear all transaction data
 */
export const clearTransactionData = (): void => {
  try {
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem(STORE_BACKUP_KEY);
    localStorage.removeItem(AMOUNT_KEY);
    localStorage.removeItem('pendingTransaction');
    localStorage.removeItem('pendingTransactionBackup');
    localStorage.removeItem('processedPendingTransaction');
    localStorage.removeItem('lastTransactionAmount');
    console.log('All transaction data cleared');
  } catch (error) {
    console.error('Error clearing transaction data:', error);
  }
};
