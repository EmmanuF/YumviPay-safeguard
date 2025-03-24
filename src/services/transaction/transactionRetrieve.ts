
// Fix async/Promise issues with the transaction retrieval service
import { Transaction } from "@/types/transaction";
import { getStoredTransactions } from "./transactionStore";

// Get transaction by ID
export const getTransactionById = async (id: string): Promise<Transaction> => {
  console.log(`getTransactionById called for ID: ${id}`);
  
  try {
    const transactions = await getStoredTransactions();
    console.log(`Retrieved ${transactions.length} transactions from storage`);
    
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
      console.error(`Transaction with ID ${id} not found in stored transactions`);
      throw new Error(`Transaction with ID ${id} not found`);
    }
    
    console.log(`Found transaction for ID ${id}:`, transaction);
    return transaction;
  } catch (error) {
    console.error(`Error retrieving transaction ${id}:`, error);
    throw error;
  }
};

// Get all transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    return await getStoredTransactions();
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    throw error;
  }
};

// Get recent transactions (last 5)
export const getRecentTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactions = await getStoredTransactions();
    return transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  } catch (error) {
    console.error("Error retrieving recent transactions:", error);
    // Return empty array instead of throwing to prevent UI failures
    return [];
  }
};

// Get transaction (alias for getTransactionById for compatibility)
export const getTransaction = async (id: string): Promise<Transaction> => {
  return getTransactionById(id);
};

// Get all transactions (alias for getTransactions for compatibility)
export const getAllTransactions = async (): Promise<Transaction[]> => {
  return getTransactions();
};
