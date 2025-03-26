
/**
 * Transaction service to manage money transfers through Kado
 */

// Import store functions directly to avoid name conflicts
import { 
  initializeTransactions,
  generateMockTransactions,
  getOfflineTransactions,
  setOfflineTransactions,
  addOfflineTransaction,
  updateOfflineTransaction,
  clearTransactionsStore,
  getStoredTransactions,
  createTransaction
} from './store';

// Re-export store functions
export { 
  initializeTransactions,
  generateMockTransactions,
  getOfflineTransactions,
  setOfflineTransactions,
  addOfflineTransaction,
  updateOfflineTransaction,
  clearTransactionsStore,
  getStoredTransactions,
  createTransaction
} from './store';

// Re-export webhook utilities
export { 
  processKadoWebhook, 
  simulateWebhook 
} from '@/services/kado/webhook';

// Export transaction creation functions
export { createKadoTransaction } from './createKadoTransaction';

// Import TransactionStatus type to ensure proper typing
import { Transaction, TransactionStatus } from '@/types/transaction';

// Now add the missing transaction query functions
export const getAllTransactions = async () => {
  const stored = await getStoredTransactions();
  return stored || [];
};

export const getRecentTransactions = async (limit = 5) => {
  const allTransactions = await getAllTransactions();
  return allTransactions.slice(0, limit);
};

export const getTransactionById = async (id: string) => {
  const allTransactions = await getAllTransactions();
  return allTransactions.find(tx => tx.id === id) || null;
};

export const updateTransactionStatus = async (
  id: string, 
  status: TransactionStatus, 
  options?: { 
    completedAt?: Date; 
    failureReason?: string; 
  }
) => {
  const allTransactions = await getAllTransactions();
  const transaction = allTransactions.find(tx => tx.id === id);
  
  if (!transaction) return null;
  
  await updateOfflineTransaction(id, {
    status,
    ...options,
    updatedAt: new Date()
  });
  
  return getTransactionById(id);
};
