
import { toast } from "@/hooks/use-toast";
import { Recipient } from "@/types/recipient";

// Transaction status types
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Transaction data interface
export interface Transaction {
  id: string;
  amount: string;
  fee: string;
  recipientId: string;
  recipientName: string;
  recipientContact: string;
  paymentMethod: string;
  provider?: string;
  country: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  failureReason?: string;
  estimatedDelivery: string;
  exchangeRate?: number;
  totalAmount: string;
}

// Mock storage for transactions
let transactions: Transaction[] = [];

// Generate a random transaction ID
const generateTransactionId = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Calculate fee based on amount and destination (simplified for demo)
const calculateFee = (amount: string, country: string): string => {
  const numAmount = parseFloat(amount);
  // Base fee of $2.99 + 1.5% of amount
  const baseFee = 2.99;
  const percentageFee = numAmount * 0.015;
  return (baseFee + percentageFee).toFixed(2);
};

// Calculate total amount (amount + fee)
const calculateTotal = (amount: string, fee: string): string => {
  const numAmount = parseFloat(amount);
  const numFee = parseFloat(fee);
  return (numAmount + numFee).toFixed(2);
};

// Get estimated delivery based on destination country and payment method
const getEstimatedDelivery = (country: string, paymentMethod: string): string => {
  if (paymentMethod.includes('mobile_money')) {
    return 'Within 15 minutes';
  } else if (paymentMethod.includes('bank_transfer')) {
    return '1-2 business days';
  } else {
    return '1-3 business days';
  }
};

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
        toast({
          title: "Payment successful",
          description: "Your transaction has been completed successfully",
        });
        resolve(updatedTransaction);
      } else {
        const updatedTransaction = updateTransactionStatus(
          transactionId, 
          'failed',
          'Payment authorization failed. Please try another payment method.'
        );
        toast({
          title: "Payment failed",
          description: "Your transaction could not be completed",
          variant: "destructive"
        });
        resolve(updatedTransaction);
      }
    }, 3000); // Simulate 3 second delay
  });
};

// Initialize with some mock transactions for demo
export const initializeMockTransactions = () => {
  if (transactions.length === 0) {
    transactions = [
      {
        id: "ABC12345",
        amount: "250.00",
        fee: "6.74",
        recipientId: "rec1",
        recipientName: "John Doe",
        recipientContact: "+234 701 234 5678",
        paymentMethod: "mobile_money",
        provider: "mtn_momo",
        country: "NG",
        status: "completed",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        estimatedDelivery: "Within 15 minutes",
        totalAmount: "256.74"
      },
      {
        id: "DEF67890",
        amount: "100.00",
        fee: "4.49",
        recipientId: "rec2",
        recipientName: "Mary Johnson",
        recipientContact: "+233 55 123 4567",
        paymentMethod: "bank_transfer",
        provider: "ecobank",
        country: "GH",
        status: "failed",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        failureReason: "Bank account validation failed",
        estimatedDelivery: "1-2 business days",
        totalAmount: "104.49"
      }
    ];
  }
};

// Call initialize on first import
initializeMockTransactions();
