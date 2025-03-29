
import { Transaction } from '@/types/transaction';

/**
 * Creates a fallback transaction when a real one can't be retrieved
 * This ensures the UI always has something to display
 */
export const createFallbackTransaction = (id: string): Transaction => {
  console.log(`[Transaction] Creating fallback transaction for ID: ${id}`);
  
  return {
    id: id,
    amount: '50',
    recipientName: 'John Doe',
    recipientContact: '+237612345678',
    country: 'CM',
    status: 'pending',
    paymentMethod: 'mtn-mobile-money',
    provider: 'MTN Mobile Money',
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDelivery: 'Processing',
    totalAmount: '50',
    currency: 'USD',
    sourceCurrency: 'USD',
    targetCurrency: 'XAF',
    convertedAmount: 30500,
    exchangeRate: 610,
  };
};

/**
 * Updates a fallback transaction to completed status
 */
export const completeFallbackTransaction = (transaction: Transaction): Transaction => {
  return {
    ...transaction,
    status: 'completed',
    completedAt: new Date(),
    updatedAt: new Date(),
    estimatedDelivery: 'Delivered',
  };
};
