
import { Transaction } from '@/types/transaction';
import { formatCurrency } from './currencyFormatter';

/**
 * Get a reliable amount from a transaction, handling various formats and fallbacks
 */
export const getReliableAmount = (transaction: Transaction | null, defaultValue = 0): number => {
  if (!transaction) return defaultValue;
  
  // Check different possible amount fields
  if (typeof transaction.amount === 'number') return transaction.amount;
  if (typeof transaction.amount === 'string') return parseFloat(transaction.amount) || defaultValue;
  if (typeof transaction.totalAmount === 'number') return transaction.totalAmount;
  if (typeof transaction.totalAmount === 'string') return parseFloat(transaction.totalAmount) || defaultValue;
  if (typeof transaction.sendAmount === 'number') return transaction.sendAmount;
  if (typeof transaction.sendAmount === 'string') return parseFloat(transaction.sendAmount) || defaultValue;
  
  return defaultValue;
};

/**
 * Store transaction amount in multiple places for redundancy
 */
export const storeTransactionAmount = (amount: number, transactionId: string): void => {
  try {
    const amountStr = amount.toString();
    localStorage.setItem(`transaction_amount_${transactionId}`, amountStr);
    localStorage.setItem(`amount_backup_${transactionId}`, amountStr);
    localStorage.setItem(`transaction_${transactionId}_amount`, amountStr);
  } catch (e) {
    console.error('Error storing transaction amount:', e);
  }
};

/**
 * Format transaction amount for display
 */
export const formatTransactionAmount = (
  amount: number | string | undefined,
  options: {
    currency?: string;
    locale?: string;
  } = {}
): string => {
  if (amount === undefined) return '$0.00';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const currency = options.currency || 'USD';
  const locale = options.locale || 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};
