
// This file is maintained for backward compatibility
// It re-exports everything from the new files to ensure existing imports work

import { Transaction, TransactionStatus } from "@/types/transaction";
import {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  getRecentTransactions,
  updateTransactionStatus,
  simulateKadoWebhook,
  initializeTransactions
} from "@/services/transaction";

// Re-export types
export type { Transaction, TransactionStatus };

// Re-export functions
export {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  getRecentTransactions,
  updateTransactionStatus,
  simulateKadoWebhook,
  initializeTransactions
};

// Call initialize on import
initializeTransactions();
