
/**
 * Utility functions for handling transaction amounts consistently
 * throughout the application
 */

// Constants
const AMOUNT_KEY_PREFIX = 'transaction_amount_';
const BACKUP_AMOUNT_KEY_PREFIX = 'transaction_amount_backup_';

/**
 * Safely parse a transaction amount to a number
 * @param value The value to parse
 * @param defaultValue Default value if parsing fails
 * @returns Parsed number or defaultValue
 */
export const parseTransactionAmount = (value: unknown, defaultValue = 0): number => {
  if (value === undefined || value === null) return defaultValue;
  
  if (typeof value === 'number') return value;
  
  if (typeof value === 'string') {
    // Remove any non-numeric characters except decimal points
    const cleanedValue = value.replace(/[^\d.]/g, '');
    const parsedValue = parseFloat(cleanedValue);
    return isNaN(parsedValue) ? defaultValue : parsedValue;
  }
  
  return defaultValue;
};

/**
 * Store a transaction amount with multiple redundancy mechanisms
 * @param amount The amount to store
 * @param transactionId The transaction ID
 */
export const storeTransactionAmount = (amount: number | string, transactionId: string): void => {
  try {
    const numericAmount = typeof amount === 'string' ? parseTransactionAmount(amount) : amount;
    
    // Store with transaction-specific keys
    localStorage.setItem(`${AMOUNT_KEY_PREFIX}${transactionId}`, numericAmount.toString());
    localStorage.setItem(`${BACKUP_AMOUNT_KEY_PREFIX}${transactionId}`, numericAmount.toString());
    
    // Also update any existing transaction data
    try {
      const transactionKey = `transaction_${transactionId}`;
      const storedData = localStorage.getItem(transactionKey);
      
      if (storedData) {
        const transaction = JSON.parse(storedData);
        transaction.amount = numericAmount;
        transaction.sendAmount = numericAmount;
        transaction.totalAmount = numericAmount;
        
        localStorage.setItem(transactionKey, JSON.stringify(transaction));
      }
    } catch (e) {
      console.error('Error updating transaction data with amount:', e);
    }
    
    console.log(`💰 Stored amount ${numericAmount} for transaction ${transactionId}`);
  } catch (e) {
    console.error('Error storing transaction amount:', e);
  }
};

/**
 * Get the most reliable amount for a transaction from multiple sources
 * @param transaction The transaction object
 * @param defaultValue Default value if no amount is found
 * @returns The most reliable amount value
 */
export const getReliableAmount = (transaction: any, defaultValue = 0): number => {
  try {
    // Try specific transaction amount key first (most reliable)
    if (transaction.id) {
      const specificAmount = localStorage.getItem(`${AMOUNT_KEY_PREFIX}${transaction.id}`);
      if (specificAmount && !isNaN(parseFloat(specificAmount))) {
        return parseFloat(specificAmount);
      }
      
      const backupAmount = localStorage.getItem(`${BACKUP_AMOUNT_KEY_PREFIX}${transaction.id}`);
      if (backupAmount && !isNaN(parseFloat(backupAmount))) {
        return parseFloat(backupAmount);
      }
    }
    
    // Try different amount fields from the transaction object
    const amountFields = ['amount', 'sendAmount', 'totalAmount'];
    for (const field of amountFields) {
      if (transaction[field] !== undefined) {
        const parsedAmount = parseTransactionAmount(transaction[field]);
        if (parsedAmount > 0) {
          return parsedAmount;
        }
      }
    }
    
    // Try fallback options
    const lastAmount = localStorage.getItem('lastTransactionAmount');
    if (lastAmount && !isNaN(parseFloat(lastAmount))) {
      return parseFloat(lastAmount);
    }
    
    return defaultValue;
  } catch (e) {
    console.error('Error getting reliable amount:', e);
    return defaultValue;
  }
};

/**
 * Format a transaction amount for display
 * @param amount The amount to format
 * @param options Formatting options
 * @returns Formatted amount string
 */
export const formatTransactionAmount = (
  amount: number | string,
  options: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  try {
    const numericAmount = parseTransactionAmount(amount);
    const {
      currency = 'USD',
      locale = 'en-US',
      minimumFractionDigits = 2,
      maximumFractionDigits = 2
    } = options;
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(numericAmount);
  } catch (e) {
    console.error('Error formatting transaction amount:', e);
    return `$${parseTransactionAmount(amount).toFixed(2)}`;
  }
};
