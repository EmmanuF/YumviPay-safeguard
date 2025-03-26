
import { Transaction } from '@/types/transaction';

interface FormatOptions {
  currency?: string;
  locale?: string;
}

/**
 * Format a transaction amount for display
 */
export const formatTransactionAmount = (
  amount: number | string,
  options: FormatOptions = {}
): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return 'N/A';
  }
  
  const { currency = 'USD', locale = 'en-US' } = options;
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericAmount);
  } catch (error) {
    console.error('Error formatting amount:', error);
    return `${currency} ${numericAmount.toFixed(2)}`;
  }
};

/**
 * Get a reliable amount value from a transaction
 * Falls back to various amount fields if the primary one is invalid
 */
export const getReliableAmount = (transaction: Transaction, fallback = 0): number => {
  if (!transaction) return fallback;
  
  // Try all possible amount fields
  const possibleAmounts = [
    transaction.amount,
    transaction.sendAmount,
    transaction.totalAmount
  ];
  
  for (const amount of possibleAmounts) {
    if (amount !== undefined && amount !== null) {
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      if (!isNaN(numericAmount) && numericAmount > 0) {
        return numericAmount;
      }
    }
  }
  
  // If no valid amount is found, return the fallback
  return fallback;
};

/**
 * Store a transaction amount in multiple places for reliability
 */
export const storeTransactionAmount = (amount: number, transactionId: string): void => {
  try {
    localStorage.setItem(`transaction_amount_${transactionId}`, amount.toString());
    localStorage.setItem(`backup_amount_${transactionId}`, amount.toString());
    localStorage.setItem('lastTransactionAmount', amount.toString());
  } catch (error) {
    console.error('Error storing transaction amount:', error);
  }
};

export default {
  formatTransactionAmount,
  getReliableAmount,
  storeTransactionAmount
};
