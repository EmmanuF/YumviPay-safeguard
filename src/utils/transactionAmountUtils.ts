
import { Transaction } from '@/types/transaction';

/**
 * Get the most reliable transaction amount from potentially inconsistent data
 */
export const getReliableAmount = (
  transaction: Transaction | null, 
  defaultAmount = 0
): number => {
  if (!transaction) return defaultAmount;
  
  // Try different amount fields
  if (typeof transaction.amount === 'number' && !isNaN(transaction.amount)) {
    return transaction.amount;
  }
  
  if (typeof transaction.amount === 'string' && transaction.amount) {
    const parsed = parseFloat(transaction.amount);
    if (!isNaN(parsed)) return parsed;
  }
  
  // Try totalAmount
  if (typeof transaction.totalAmount === 'number' && !isNaN(transaction.totalAmount)) {
    return transaction.totalAmount;
  }
  
  if (typeof transaction.totalAmount === 'string' && transaction.totalAmount) {
    const parsed = parseFloat(transaction.totalAmount);
    if (!isNaN(parsed)) return parsed;
  }
  
  // Try sendAmount
  if (typeof transaction.sendAmount === 'number' && !isNaN(transaction.sendAmount)) {
    return transaction.sendAmount;
  }
  
  if (typeof transaction.sendAmount === 'string' && transaction.sendAmount) {
    const parsed = parseFloat(transaction.sendAmount);
    if (!isNaN(parsed)) return parsed;
  }
  
  return defaultAmount;
};

/**
 * Format transaction amount for display
 */
export const formatTransactionAmount = (
  amount: number | string,
  options: {
    currency?: string;
    locale?: string;
  } = {}
): string => {
  const { currency = 'USD', locale = 'en-US' } = options;
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return '0.00';
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
    }).format(numericAmount);
  } catch (e) {
    return `${currency} ${numericAmount.toFixed(2)}`;
  }
};

/**
 * Store transaction amount in multiple locations for reliability
 */
export const storeTransactionAmount = (amount: number, transactionId: string): void => {
  try {
    // Store in localStorage for persistence
    localStorage.setItem(`tx_amount_${transactionId}`, amount.toString());
    
    // Also store in sessionStorage
    sessionStorage.setItem(`tx_amount_${transactionId}`, amount.toString());
    
    console.log(`[TransactionAmount] Stored amount ${amount} for transaction ${transactionId}`);
  } catch (e) {
    console.error('[TransactionAmount] Error storing amount:', e);
  }
};

/**
 * Generate transaction ID utility
 */
export const generateTransactionId = (): string => {
  return `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};
