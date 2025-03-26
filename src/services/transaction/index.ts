
// Export functions from transaction submodules
import { 
  getTransactionById,
  getTransaction,
  getTransactions,
  getAllTransactions,
  getRecentTransactions
} from './transactionRetrieve';

import {
  updateTransactionStatus
} from './update';

import {
  simulateWebhook
} from './update/webhookSimulator';

import {
  createTransaction
} from './create';

import {
  initializeTransactions,
  getStoredTransactions,
  getOfflineTransactions,
  setOfflineTransactions,
  addOfflineTransaction,
  updateOfflineTransaction,
  clearTransactionsStore
} from './store';

// Export everything for use throughout the app
export {
  // Retrieval functions
  getTransactionById,
  getTransaction,
  getTransactions,
  getAllTransactions,
  getRecentTransactions,
  
  // Update functions
  updateTransactionStatus,
  simulateWebhook,
  
  // Creation functions
  createTransaction,
  
  // Storage functions
  initializeTransactions,
  getStoredTransactions,
  getOfflineTransactions,
  setOfflineTransactions,
  addOfflineTransaction,
  updateOfflineTransaction,
  clearTransactionsStore
};
