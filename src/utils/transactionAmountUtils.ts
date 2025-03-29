
/**
 * Utilities for handling transaction amounts consistently across the app
 */

// Get a reliable amount from a transaction, with fallback values
export const getReliableAmount = (transaction: any, defaultAmount: number = 50): number => {
  if (!transaction) return defaultAmount;
  
  // Try all possible sources for the amount
  const possibleAmounts = [
    parseFloat(transaction.amount),
    parseFloat(transaction.totalAmount),
    parseFloat(transaction.sendAmount),
    defaultAmount
  ];
  
  // Return the first valid number
  for (const amount of possibleAmounts) {
    if (!isNaN(amount) && amount > 0) {
      return amount;
    }
  }
  
  return defaultAmount;
};

// Store transaction amount in multiple locations for greater reliability
export const storeTransactionAmount = (amount: number, transactionId: string): void => {
  if (!transactionId) return;
  
  try {
    // Store with different keys for better redundancy
    localStorage.setItem(`tx_amount_${transactionId}`, amount.toString());
    localStorage.setItem(`transaction_amount_${transactionId}`, amount.toString());
    localStorage.setItem(`amount_${transactionId}`, amount.toString());
  } catch (e) {
    console.error('Error storing transaction amount:', e);
  }
};

// Format transaction amount with currency
export const formatTransactionAmount = (
  amount: number | string,
  options: {
    currency?: string;
    locale?: string;
    style?: string;
  } = {}
): string => {
  // Convert to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Default options
  const {
    currency = 'USD',
    locale = 'en-US',
    style = 'currency'
  } = options;
  
  // Format the amount
  try {
    return new Intl.NumberFormat(locale, {
      style,
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  } catch (e) {
    // Fallback formatting
    return `${currency} ${numAmount.toFixed(2)}`;
  }
};
