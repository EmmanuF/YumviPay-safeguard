
// Fix async/Promise issues with the transaction retrieval service
import { Transaction } from "@/types/transaction";
import { getStoredTransactions } from "./transactionStore";

// Get transaction by ID
export const getTransactionById = async (id: string): Promise<Transaction> => {
  const transactions = await getStoredTransactions();
  const transaction = transactions.find(t => t.id === id);
  
  if (!transaction) {
    throw new Error(`Transaction with ID ${id} not found`);
  }
  
  return transaction;
};

// Get all transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  return await getStoredTransactions();
};

// Get recent transactions (last 5)
export const getRecentTransactions = async (): Promise<Transaction[]> => {
  const transactions = await getStoredTransactions();
  return transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
};

// Get transaction (alias for getTransactionById for compatibility)
export const getTransaction = async (id: string): Promise<Transaction> => {
  return getTransactionById(id);
};

// Get all transactions (alias for getTransactions for compatibility)
export const getAllTransactions = async (): Promise<Transaction[]> => {
  return getTransactions();
};
