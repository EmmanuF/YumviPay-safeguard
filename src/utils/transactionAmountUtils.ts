
/**
 * Utilities for handling transaction amounts with improved reliability
 */

// Get a reliable amount from a transaction with multiple fallbacks
export const getReliableAmount = (transaction: any, defaultAmount: number = 0): number => {
  if (!transaction) return defaultAmount;
  
  // Try all possible amount properties with type conversion
  const possibleAmounts = [
    transaction.amount,
    transaction.sendAmount,
    transaction.totalAmount,
    localStorage.getItem(`transaction_amount_${transaction.id}`),
    localStorage.getItem('lastTransactionAmount')
  ];
  
  // Convert to number and filter out NaN/0 values
  const validAmounts = possibleAmounts
    .map(amount => {
      if (amount === null || amount === undefined) return NaN;
      if (typeof amount === 'string') return parseFloat(amount);
      return Number(amount);
    })
    .filter(amount => !isNaN(amount) && amount > 0);
  
  // Return first valid amount or default
  return validAmounts.length > 0 ? validAmounts[0] : defaultAmount;
};

// Store transaction amount in multiple places for redundancy
export const storeTransactionAmount = (amount: number, transactionId?: string): void => {
  if (isNaN(amount) || amount <= 0) {
    console.error('Invalid amount to store:', amount);
    return;
  }
  
  try {
    const amountStr = amount.toString();
    
    // Store in multiple keys for redundancy
    localStorage.setItem('lastTransactionAmount', amountStr);
    localStorage.setItem('transaction_amount', amountStr);
    
    if (transactionId) {
      localStorage.setItem(`transaction_amount_${transactionId}`, amountStr);
    }
    
    console.log(`Transaction amount ${amount} stored with redundancy`);
  } catch (error) {
    console.error('Error storing transaction amount:', error);
  }
};

// Format transaction amount with proper currency symbol and precision
export const formatTransactionAmount = (amount: number, options: {
  currency?: string;
  locale?: string;
  precision?: number;
} = {}): string => {
  const {
    currency = 'USD',
    locale = 'en-US',
    precision = 2
  } = options;
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    }).format(amount);
  } catch (error) {
    console.error('Error formatting amount:', error);
    return `${currency} ${amount.toFixed(precision)}`;
  }
};
