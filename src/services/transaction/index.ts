
import { Transaction, TransactionStatus } from "@/types/transaction";

// Re-export types
export type { Transaction, TransactionStatus };

// Re-export functions from individual modules
export { createTransaction } from "./transactionCreate";
export { 
  getTransactionById, 
  getAllTransactions, 
  getRecentTransactions 
} from "./transactionRetrieve";
export { 
  updateTransactionStatus, 
  simulateKadoWebhook 
} from "./transactionUpdate";
export { initializeTransactions } from "./transactionStore";

// Initialize transactions on import
import { initializeTransactions } from "./transactionStore";
initializeTransactions();
