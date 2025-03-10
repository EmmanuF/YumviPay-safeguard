
import { Transaction, TransactionStatus } from "@/types/transaction";
import { Recipient } from "@/types/recipient";
import { apiService } from "../apiService";
import { 
  calculateFee, 
  calculateTotal, 
  generateTransactionId, 
  getEstimatedDelivery
} from "@/utils/transactionUtils";
import { useNetwork } from "@/contexts/NetworkContext";

// Create a new transaction
export const createTransaction = (
  amount: string,
  recipient: Recipient,
  paymentMethod: string,
  provider?: string
): Transaction => {
  const { isOffline, addPausedRequest } = useNetwork();
  const fee = calculateFee(amount, recipient.country);
  const totalAmount = calculateTotal(amount, fee);
  
  // Create transaction object
  const transaction: Transaction = {
    id: generateTransactionId(),
    amount,
    fee,
    recipientId: recipient.id,
    recipientName: recipient.name,
    recipientContact: recipient.contact,
    paymentMethod,
    provider,
    country: recipient.country,
    status: isOffline ? 'offline-pending' : 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDelivery: getEstimatedDelivery(recipient.country, paymentMethod),
    totalAmount
  };
  
  if (isOffline) {
    // Store transaction locally if offline
    addOfflineTransaction(transaction);
    
    // Queue the API call for when connection is restored
    addPausedRequest(async () => {
      try {
        const result = await apiService.transactions.create(transaction);
        
        // Update the local transaction with server data
        updateLocalTransaction(transaction.id, {
          ...transaction,
          ...result,
          status: 'pending'
        });
        
        return result;
      } catch (error) {
        console.error('Failed to sync transaction:', error);
        throw error;
      }
    });
    
    return transaction;
  }
  
  try {
    // Send to API if online - but don't wait for response
    apiService.transactions.create(transaction)
      .then(result => {
        console.log('Transaction created on API:', result);
      })
      .catch(error => {
        console.error('Error creating transaction via API:', error);
      });
    
    return transaction;
  } catch (error) {
    // Fallback to local storage on API error
    console.error('Error creating transaction via API:', error);
    addOfflineTransaction(transaction);
    return transaction;
  }
};

// Add a transaction to the offline cache
// This is an internal function used by the module
const addOfflineTransaction = (transaction: Transaction) => {
  import("./transactionStore").then(({ getOfflineTransactions, setOfflineTransactions }) => {
    const offlineTransactions = getOfflineTransactions();
    setOfflineTransactions([...offlineTransactions, transaction]);
  });
};

// Update a transaction in the offline cache
// This is an internal function used by the module
const updateLocalTransaction = (id: string, updatedTransaction: Transaction) => {
  import("./transactionStore").then(({ getOfflineTransactions, setOfflineTransactions }) => {
    const offlineTransactions = getOfflineTransactions();
    const index = offlineTransactions.findIndex(t => t.id === id);
    if (index >= 0) {
      offlineTransactions[index] = updatedTransaction;
      setOfflineTransactions([...offlineTransactions]);
    }
  });
};
