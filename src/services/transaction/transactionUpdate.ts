
import { Transaction, TransactionStatus } from "@/types/transaction";
import { apiService } from "../apiService";
import { useNetwork } from "@/contexts/NetworkContext";
import { showToast } from "@/utils/transactionUtils";

// Update transaction status
export const updateTransactionStatus = (
  id: string, 
  status: TransactionStatus,
  failureReason?: string
): Transaction | null => {
  const { isOffline, addPausedRequest } = useNetwork();
  const { getOfflineTransactions, setOfflineTransactions } = require("./transactionStore");
  
  // Update local transaction
  const offlineTransactions = getOfflineTransactions();
  const transaction = offlineTransactions.find(t => t.id === id);
  
  if (!transaction) {
    return null;
  }
  
  // Update local data
  const updatedTransaction = {
    ...transaction,
    status,
    updatedAt: new Date(),
    ...(status === 'completed' && { completedAt: new Date() }),
    ...(status === 'failed' && failureReason && { failureReason })
  };
  
  // Update in local cache
  const index = offlineTransactions.findIndex(t => t.id === id);
  if (index >= 0) {
    offlineTransactions[index] = updatedTransaction;
    setOfflineTransactions([...offlineTransactions]);
  }
  
  if (isOffline) {
    // Queue the API update for when connection is restored
    addPausedRequest(async () => {
      try {
        return await apiService.transactions.update(id, { 
          status, 
          failureReason 
        });
      } catch (error) {
        console.error('Failed to sync transaction status update:', error);
        throw error;
      }
    });
    
    return updatedTransaction;
  }
  
  // Send to API if online - but don't wait
  apiService.transactions.update(id, { status, failureReason })
    .then(result => {
      console.log('Transaction status updated on API:', result);
    })
    .catch(error => {
      console.error('Error updating transaction status via API:', error);
    });
  
  return updatedTransaction;
};

// Simulate Kado webhook response (would be replaced by real Kado integration)
export const simulateKadoWebhook = async (transactionId: string): Promise<Transaction | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { getTransactionById } = require("./transactionRetrieve");
      const transaction = getTransactionById(transactionId);
      
      if (!transaction) {
        resolve(null);
        return;
      }
      
      // Simulate 90% success rate
      const isSuccessful = Math.random() < 0.9;
      
      if (isSuccessful) {
        const updatedTransaction = updateTransactionStatus(transactionId, 'completed');
        showToast(
          "Payment successful",
          "Your transaction has been completed successfully"
        );
        resolve(updatedTransaction);
      } else {
        const updatedTransaction = updateTransactionStatus(
          transactionId, 
          'failed',
          'Payment authorization failed. Please try another payment method.'
        );
        showToast(
          "Payment failed",
          "Your transaction could not be completed",
          "destructive"
        );
        resolve(updatedTransaction);
      }
    }, 3000); // Simulate 3 second delay
  });
};
