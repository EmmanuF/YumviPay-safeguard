
/**
 * Transaction Amount Utilities
 * 
 * A centralized set of functions for consistent amount handling throughout the application
 */

import { Transaction } from '@/types/transaction';

/**
 * Get a reliable transaction amount from any transaction object
 * 
 * @param transaction The transaction to extract amount from
 * @param fallbackAmount Optional fallback amount if no amount can be extracted
 * @returns The most reliable transaction amount as a number
 */
export const getReliableAmount = (
  transaction?: Transaction | null,
  fallbackAmount: number = 0
): number => {
  if (!transaction) {
    // Try to get amount from transaction data store
    if (typeof window !== 'undefined' && window.getTransactionAmount) {
      const amount = window.getTransactionAmount();
      if (amount && !isNaN(amount)) return Number(amount);
    }
    
    // Try localStorage fallback
    try {
      const storedAmount = localStorage.getItem('lastTransactionAmount');
      if (storedAmount && !isNaN(parseFloat(storedAmount))) {
        return parseFloat(storedAmount);
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
    
    return fallbackAmount;
  }
  
  // Transaction exists, try to get the most accurate amount
  
  // First try sendAmount (most accurate for send flow)
  if (transaction.sendAmount !== undefined) {
    return typeof transaction.sendAmount === 'number' 
      ? transaction.sendAmount 
      : parseFloat(String(transaction.sendAmount)) || fallbackAmount;
  }
  
  // Next try amount
  if (transaction.amount !== undefined) {
    return typeof transaction.amount === 'number' 
      ? transaction.amount 
      : parseFloat(String(transaction.amount)) || fallbackAmount;
  }
  
  // Try totalAmount
  if (transaction.totalAmount !== undefined) {
    return typeof transaction.totalAmount === 'number' 
      ? transaction.totalAmount 
      : parseFloat(String(transaction.totalAmount)) || fallbackAmount;
  }
  
  // Last resort - use the fallback
  return fallbackAmount;
};

/**
 * Format a transaction amount for display
 * 
 * @param amount The amount to format
 * @param options Formatting options
 * @returns Formatted amount string
 */
export const formatTransactionAmount = (
  amount: number | string | undefined,
  options: {
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    fallback?: string;
  } = {}
): string => {
  // Default options
  const {
    currency = 'USD',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    fallback = '0.00'
  } = options;
  
  // Handle undefined or invalid input
  if (amount === undefined) return fallback;
  
  // Parse amount to number if it's a string
  const numericAmount = typeof amount === 'string' 
    ? parseFloat(amount) 
    : amount;
  
  // Check if parsing resulted in a valid number
  if (isNaN(numericAmount)) return fallback;
  
  // Format the amount
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(numericAmount);
  } catch (error) {
    console.error('Error formatting amount:', error);
    return `${currency} ${numericAmount.toFixed(minimumFractionDigits)}`;
  }
};

/**
 * Safely store a transaction amount in multiple locations for redundancy
 * 
 * @param amount The amount to store
 * @param transactionId Optional transaction ID for more specific storage
 */
export const storeTransactionAmount = (
  amount: number | string,
  transactionId?: string
): void => {
  if (amount === undefined || amount === null) {
    console.error('Cannot store undefined or null amount');
    return;
  }
  
  // Convert to number for consistency
  const numericAmount = typeof amount === 'string' 
    ? parseFloat(amount) 
    : amount;
  
  if (isNaN(numericAmount)) {
    console.error('Cannot store NaN amount:', amount);
    return;
  }
  
  try {
    // Store as string for consistency
    const amountStr = numericAmount.toString();
    
    // Store in primary locations
    localStorage.setItem('lastTransactionAmount', amountStr);
    if (transactionId) {
      localStorage.setItem(`amount_${transactionId}`, amountStr);
    }
    
    // Store in window object if available (for cross-component access)
    if (typeof window !== 'undefined') {
      // @ts-ignore - Using window for emergency backup
      window.__TRANSACTION_AMOUNT = numericAmount;
    }
    
    console.log(`Amount ${numericAmount} stored successfully`);
  } catch (e) {
    console.error('Error storing transaction amount:', e);
  }
};
