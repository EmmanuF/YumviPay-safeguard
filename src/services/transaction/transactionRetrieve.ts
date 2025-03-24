
// Fix async/Promise issues with the transaction retrieval service
import { Transaction } from "@/types/transaction";
import { getStoredTransactions } from "./transactionStore";
import { toast } from 'sonner';

// Get transaction by ID
export const getTransactionById = async (id: string): Promise<Transaction> => {
  console.log(`getTransactionById called for ID: ${id}`);
  
  try {
    const transactions = await getStoredTransactions();
    console.log(`Retrieved ${transactions.length} transactions from storage`);
    
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
      console.log(`Transaction with ID ${id} not found in stored transactions, checking local storage`);
      
      // Check if the ID might be a transaction we just created
      // This is a fallback for transactions that might not be in storage yet
      if (localStorage.getItem(`transaction_${id}`)) {
        try {
          const tempTransaction = JSON.parse(localStorage.getItem(`transaction_${id}`) || '');
          console.log(`Found transaction in localStorage with key transaction_${id}`, tempTransaction);
          
          // Convert the temporary transaction to a proper Transaction object
          return {
            id: tempTransaction.transactionId || tempTransaction.id || id,
            amount: tempTransaction.amount || '0',
            recipientName: tempTransaction.recipientName || 'Unknown',
            recipientContact: tempTransaction.recipientContact || '',
            country: tempTransaction.country || 'Unknown',
            status: tempTransaction.status || 'pending',
            createdAt: new Date(tempTransaction.createdAt || Date.now()),
            updatedAt: new Date(tempTransaction.updatedAt || Date.now()),
            estimatedDelivery: 'Processing',
            totalAmount: tempTransaction.amount || '0',
            provider: tempTransaction.provider || 'Unknown',
            paymentMethod: tempTransaction.paymentMethod || 'unknown'
          };
        } catch (parseError) {
          console.error(`Error parsing temporary transaction ${id}:`, parseError);
        }
      }
      
      console.warn(`Transaction with ID ${id} not found, creating fallback transaction`);
      
      // If we still can't find the transaction, create a fallback one to avoid errors
      return {
        id: id,
        amount: '0',
        recipientName: 'Unknown Recipient',
        recipientContact: '',
        country: 'Unknown',
        status: 'processing' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedDelivery: 'Processing',
        totalAmount: '0',
        provider: 'Unknown',
        paymentMethod: 'unknown'
      };
    }
    
    console.log(`Found transaction for ID ${id}:`, transaction);
    return transaction;
  } catch (error) {
    console.error(`Error retrieving transaction ${id}:`, error);
    
    // Display a toast for user feedback
    toast.error("Transaction Error", {
      description: `Could not retrieve transaction details. Please try again.`,
    });
    
    // Return a fallback transaction with error state
    return {
      id: id,
      amount: '0',
      recipientName: 'Error retrieving transaction',
      recipientContact: '',
      country: 'Unknown',
      status: 'failed' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDelivery: 'Error',
      failureReason: error instanceof Error ? error.message : 'Unknown error',
      totalAmount: '0',
      provider: 'Unknown',
      paymentMethod: 'unknown'
    };
  }
};

// Get all transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    return await getStoredTransactions();
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return []; // Return empty array instead of throwing
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
