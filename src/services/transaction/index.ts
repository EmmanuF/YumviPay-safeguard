
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
