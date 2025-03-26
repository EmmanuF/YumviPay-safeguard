
/**
 * Entry point for transaction retrieval operations
 * Re-exports all transaction retrieval functions from sub-modules
 */

// Export transaction by ID retrieval functions
export { 
  getTransactionById,
  getTransaction 
} from './retrieval/transactionById';

// Export multiple transactions retrieval functions
export { 
  getAllTransactions,
  getRecentTransactions,
  getTransactions 
} from './retrieval/allTransactions';

// Export utility functions for other modules to use
export { 
  normalizeTransaction,
  mapDatabaseTransactionToModel 
} from './utils/transactionMappers';

export { 
  createFallbackTransaction 
} from './utils/fallbackTransactions';
