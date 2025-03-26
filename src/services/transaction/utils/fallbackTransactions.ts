
import { Transaction } from '@/types/transaction';

/**
 * Create a fallback transaction for when the real transaction can't be found
 * This is mainly for development/testing purposes
 */
export const createFallbackTransaction = (id: string): Transaction => {
  console.log(`[Fallback] Creating fallback transaction for ID: ${id}`);
  
  const now = new Date();
  
  // Create a realistic fallback transaction
  const fallbackTransaction: Transaction = {
    id: id,
    amount: '50',
    sendAmount: '50',
    recipientName: 'John Doe',
    recipientContact: '+237612345678',
    country: 'CM',
    status: 'completed',
    createdAt: now,
    updatedAt: now,
    completedAt: now,
    estimatedDelivery: 'Delivered',
    totalAmount: '50',
    provider: 'MTN Mobile Money',
    paymentMethod: 'mtn-mobile-money',
    currency: 'XAF',
    sourceCurrency: 'USD',
    targetCurrency: 'XAF',
    convertedAmount: 30500,
    exchangeRate: 610
  };
  
  // Store the fallback transaction for future retrievals
  try {
    localStorage.setItem(`transaction_${id}`, JSON.stringify({
      ...fallbackTransaction,
      createdAt: fallbackTransaction.createdAt.toISOString(),
      updatedAt: fallbackTransaction.updatedAt.toISOString(),
      completedAt: fallbackTransaction.completedAt.toISOString()
    }));
    
    // Also store with backup keys for redundancy
    localStorage.setItem(`transaction_backup_${id}`, JSON.stringify({
      ...fallbackTransaction,
      createdAt: fallbackTransaction.createdAt.toISOString(),
      updatedAt: fallbackTransaction.updatedAt.toISOString(),
      completedAt: fallbackTransaction.completedAt.toISOString()
    }));
  } catch (e) {
    console.error('[Fallback] Error storing fallback transaction:', e);
  }
  
  return fallbackTransaction;
};
