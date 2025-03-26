
import { Transaction } from '@/types/transaction';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a fallback transaction for development/testing
 */
export const createFallbackTransaction = (id: string): Transaction => {
  console.log('[DEBUG] Creating fallback transaction with ID:', id);
  
  const fallbackTransaction: Transaction = {
    id: id || uuidv4(),
    amount: 50,
    recipientName: 'John Doe',
    recipientContact: '+237612345678',
    country: 'CM',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: new Date(),
    estimatedDelivery: 'Delivered',
    totalAmount: 50,
    sendAmount: 50,
    provider: 'MTN Mobile Money',
    paymentMethod: 'mobile_money',
    currency: 'XAF',
    recipientCountry: 'Cameroon',
    recipientCountryCode: 'CM',
    sourceCurrency: 'USD',
    targetCurrency: 'XAF',
    convertedAmount: 30500,
    exchangeRate: 610,
    date: new Date().toISOString(),
    type: 'send'
  };
  
  // Store the fallback transaction for future retrieval
  try {
    const serialized = JSON.stringify({
      ...fallbackTransaction,
      createdAt: fallbackTransaction.createdAt.toISOString(),
      updatedAt: fallbackTransaction.updatedAt.toISOString(),
      completedAt: fallbackTransaction.completedAt?.toISOString()
    });
    
    localStorage.setItem(`transaction_${id}`, serialized);
    localStorage.setItem(`transaction_backup_${id}`, serialized);
    localStorage.setItem(`fallback_transaction_${id}`, serialized);
  } catch (e) {
    console.error('[DEBUG] Error storing fallback transaction:', e);
  }
  
  return fallbackTransaction;
};
