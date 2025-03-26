
/**
 * Transaction service to manage money transfers through Kado
 */

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

// Now add the missing transaction query functions
export const getAllTransactions = async () => {
  const stored = getStoredTransactions();
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
  status: string, 
  options?: { completedAt?: Date; failureReason?: string }
) => {
  const allTransactions = await getAllTransactions();
  const transaction = allTransactions.find(tx => tx.id === id);
  
  if (!transaction) return null;
  
  updateOfflineTransaction(id, {
    status,
    ...options,
    updatedAt: new Date()
  });
  
  return getTransactionById(id);
};
