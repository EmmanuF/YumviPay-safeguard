
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
    status: 'pending', // Start as pending so we can see the progress
    createdAt: now,
    updatedAt: now,
    completedAt: undefined, // Don't set completed time for pending transactions
    estimatedDelivery: 'Processing',
    totalAmount: '50',
    provider: 'MTN Mobile Money',
    paymentMethod: 'mtn-mobile-money',
    currency: 'XAF',
    sourceCurrency: 'USD',
    targetCurrency: 'XAF',
    convertedAmount: 30500,
    exchangeRate: 610
  };
  
  // Store the fallback transaction for future retrievals in multiple locations for redundancy
  try {
    const storageData = JSON.stringify({
      ...fallbackTransaction,
      createdAt: fallbackTransaction.createdAt.toISOString(),
      updatedAt: fallbackTransaction.updatedAt.toISOString(),
      completedAt: fallbackTransaction.completedAt
    });
    
    // Store with multiple keys for maximum reliability
    localStorage.setItem(`transaction_${id}`, storageData);
    localStorage.setItem(`transaction_backup_${id}`, storageData);
    localStorage.setItem(`emergency_transaction_${id}`, storageData);
    localStorage.setItem(`direct_transaction_${id}`, storageData);
    
    // Also store in session storage for additional redundancy
    sessionStorage.setItem(`transaction_session_${id}`, storageData);
    
    console.log(`[Fallback] Transaction ${id} stored with multiple keys`);
    
    // Simulate a webhook after 3 seconds to update to completed
    setTimeout(() => {
      try {
        console.log(`[Fallback] Simulating completion for transaction ${id}`);
        const completedTransaction = {
          ...fallbackTransaction,
          status: 'completed',
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem(`transaction_${id}`, JSON.stringify(completedTransaction));
        localStorage.setItem(`transaction_backup_${id}`, JSON.stringify(completedTransaction));
        localStorage.setItem(`completed_transaction_${id}`, JSON.stringify(completedTransaction));
        
        console.log(`[Fallback] Transaction ${id} marked as completed`);
      } catch (e) {
        console.error('[Fallback] Error simulating completion:', e);
      }
    }, 3000);
    
  } catch (e) {
    console.error('[Fallback] Error storing fallback transaction:', e);
  }
  
  return fallbackTransaction;
};

/**
 * Complete a pending fallback transaction
 */
export const completeFallbackTransaction = (id: string): Transaction | null => {
  try {
    const transactionKey = `transaction_${id}`;
    const storedData = localStorage.getItem(transactionKey);
    
    if (!storedData) {
      console.error(`[Fallback] No transaction found with ID: ${id}`);
      return null;
    }
    
    const transaction = JSON.parse(storedData);
    const now = new Date();
    
    const completedTransaction = {
      ...transaction,
      status: 'completed',
      updatedAt: now.toISOString(),
      completedAt: now.toISOString()
    };
    
    localStorage.setItem(transactionKey, JSON.stringify(completedTransaction));
    localStorage.setItem(`transaction_backup_${id}`, JSON.stringify(completedTransaction));
    localStorage.setItem(`completed_transaction_${id}`, JSON.stringify(completedTransaction));
    
    console.log(`[Fallback] Transaction ${id} manually completed`);
    
    return {
      ...completedTransaction,
      createdAt: new Date(completedTransaction.createdAt),
      updatedAt: now,
      completedAt: now
    };
  } catch (e) {
    console.error('[Fallback] Error completing fallback transaction:', e);
    return null;
  }
};
