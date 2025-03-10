
import { Transaction } from "@/types/transaction";
import { apiService } from "../apiService";
import { useNetwork } from "@/contexts/NetworkContext";

// Get transaction by ID
export const getTransactionById = (id: string): Transaction | undefined => {
  // First check local cache
  const { getOfflineTransactions } = require("./transactionStore");
  const localTransaction = getOfflineTransactions().find(t => t.id === id);
  if (localTransaction) {
    return localTransaction;
  }
  
  // If not found locally but we're online, try to get from API
  // but return undefined while waiting for API
  const { isOffline } = useNetwork();
  if (!isOffline) {
    apiService.transactions.getById(id)
      .then(transaction => {
        // Add to local cache if found
        if (transaction) {
          const { getOfflineTransactions, setOfflineTransactions } = require("./transactionStore");
          const offlineTransactions = getOfflineTransactions();
          if (!offlineTransactions.some(t => t.id === transaction.id)) {
            setOfflineTransactions([...offlineTransactions, transaction]);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching transaction from API:', error);
      });
  }
  
  return undefined;
};

// Get all transactions
export const getAllTransactions = (): Transaction[] => {
  const { isOffline } = useNetwork();
  const { getOfflineTransactions, setOfflineTransactions } = require("./transactionStore");
  
  // Start API fetch if online, but don't wait for response
  if (!isOffline) {
    apiService.transactions.getAll()
      .then(apiTransactions => {
        // Update local cache with latest data
        setOfflineTransactions(apiTransactions);
      })
      .catch(error => {
        console.error('Error fetching transactions from API:', error);
      });
  }
  
  // Return cached transactions immediately
  return [...getOfflineTransactions()].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );
};

// Get recent transactions (limited count)
export const getRecentTransactions = (limit: number = 5): Transaction[] => {
  const transactions = getAllTransactions();
  return transactions.slice(0, limit);
};
