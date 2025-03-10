
import { Transaction, TransactionStatus } from "@/types/transaction";
import { Recipient } from "@/types/recipient";
import { apiService } from "./apiService";
import { 
  calculateFee, 
  calculateTotal, 
  generateTransactionId, 
  getEstimatedDelivery,
  showToast 
} from "@/utils/transactionUtils";
import { mockTransactions } from "@/data/mockTransactions";
import { useNetwork } from "@/contexts/NetworkContext";

// Fallback to mock data when offline or API fails
let offlineTransactions: Transaction[] = [...mockTransactions];

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
    offlineTransactions.push(transaction);
    
    // Queue the API call for when connection is restored
    addPausedRequest(async () => {
      try {
        const result = await apiService.transactions.create(transaction);
        
        // Update the local transaction with server data
        const index = offlineTransactions.findIndex(t => t.id === transaction.id);
        if (index >= 0) {
          offlineTransactions[index] = {
            ...offlineTransactions[index],
            ...result,
            status: 'pending'
          };
        }
        
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
    offlineTransactions.push(transaction);
    return transaction;
  }
};

// Get transaction by ID
export const getTransactionById = (id: string): Transaction | undefined => {
  // First check local cache
  const localTransaction = offlineTransactions.find(t => t.id === id);
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
        if (transaction && !offlineTransactions.some(t => t.id === transaction.id)) {
          offlineTransactions.push(transaction);
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
  
  // Start API fetch if online, but don't wait for response
  if (!isOffline) {
    apiService.transactions.getAll()
      .then(apiTransactions => {
        // Update local cache with latest data
        offlineTransactions = apiTransactions;
      })
      .catch(error => {
        console.error('Error fetching transactions from API:', error);
      });
  }
  
  // Return cached transactions immediately
  return [...offlineTransactions].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );
};

// Get recent transactions (limited count)
export const getRecentTransactions = (limit: number = 5): Transaction[] => {
  const transactions = getAllTransactions();
  return transactions.slice(0, limit);
};

// Update transaction status
export const updateTransactionStatus = (
  id: string, 
  status: TransactionStatus,
  failureReason?: string
): Transaction | null => {
  const { isOffline, addPausedRequest } = useNetwork();
  
  // Update local transaction
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

// Initialize transactions cache
export const initializeTransactions = async () => {
  // Try to load from API first
  try {
    const apiTransactions = await apiService.transactions.getAll();
    offlineTransactions = apiTransactions;
  } catch (error) {
    console.error('Could not initialize transactions from API, using mock data:', error);
    if (offlineTransactions.length === 0) {
      offlineTransactions = [...mockTransactions];
    }
  }
};
