
import { Recipient } from "@/types/recipient";
import { Transaction, TransactionStatus } from "@/types/transaction";
import { 
  calculateFee, 
  calculateTotal, 
  generateTransactionId, 
  getEstimatedDelivery,
  showToast 
} from "@/utils/transactionUtils";
import { mockTransactions } from "@/data/mockTransactions";

// Mock storage for transactions
let transactions: Transaction[] = [...mockTransactions];

// Create a new transaction
export const createTransaction = (
  amount: string,
  recipient: Recipient,
  paymentMethod: string,
  provider?: string
): Transaction => {
  const fee = calculateFee(amount, recipient.country);
  const totalAmount = calculateTotal(amount, fee);
  
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
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDelivery: getEstimatedDelivery(recipient.country, paymentMethod),
    totalAmount
  };
  
  transactions.push(transaction);
  return transaction;
};

// Get transaction by ID
export const getTransactionById = (id: string): Transaction | undefined => {
  return transactions.find(t => t.id === id);
};

// Get all transactions
export const getAllTransactions = (): Transaction[] => {
  return [...transactions].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );
};

// Get recent transactions (limited count)
export const getRecentTransactions = (limit: number = 5): Transaction[] => {
  return getAllTransactions().slice(0, limit);
};

// Update transaction status
export const updateTransactionStatus = (
  id: string, 
  status: TransactionStatus,
  failureReason?: string
): Transaction | null => {
  const transaction = transactions.find(t => t.id === id);
  
  if (!transaction) {
    return null;
  }
  
  transaction.status = status;
  transaction.updatedAt = new Date();
  
  if (status === 'completed') {
    transaction.completedAt = new Date();
  } else if (status === 'failed' && failureReason) {
    transaction.failureReason = failureReason;
  }
  
  return transaction;
};

// Simulate Kado webhook response
export const simulateKadoWebhook = (transactionId: string): Promise<Transaction | null> => {
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

// Initialize transactions - This is called by useTransactions when needed
export const initializeTransactions = () => {
  if (transactions.length === 0) {
    transactions = [...mockTransactions];
  }
};
