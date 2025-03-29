
import { Transaction } from '@/types/transaction';
import { v4 as uuidv4 } from 'uuid';

// Local storage keys
const TRANSACTIONS_STORE_KEY = 'transactions_store';
const OFFLINE_TRANSACTIONS_KEY = 'offline_transactions';

// Initialize the transaction store
export const initializeTransactions = (): void => {
  if (!localStorage.getItem(TRANSACTIONS_STORE_KEY)) {
    localStorage.setItem(TRANSACTIONS_STORE_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(OFFLINE_TRANSACTIONS_KEY)) {
    localStorage.setItem(OFFLINE_TRANSACTIONS_KEY, JSON.stringify([]));
  }
};

// Generate mock transactions for testing
export const generateMockTransactions = async (): Promise<Transaction[]> => {
  const mockTransactions: Transaction[] = [
    {
      id: uuidv4(),
      amount: '100.00',
      recipientName: 'John Doe',
      country: 'CM',
      status: 'completed',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      recipientContact: '+237612345678',
      paymentMethod: 'mobile_money',
      provider: 'MTN Mobile Money',
      estimatedDelivery: 'Delivered'
    },
    {
      id: uuidv4(),
      amount: '75.50',
      recipientName: 'Jane Smith',
      country: 'CM',
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      recipientContact: '+237687654321',
      paymentMethod: 'mobile_money',
      provider: 'Orange Money',
      estimatedDelivery: '15 minutes'
    },
    {
      id: uuidv4(),
      amount: '50.25',
      recipientName: 'Robert Johnson',
      country: 'CM',
      status: 'failed',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      recipientContact: '+237698765432',
      paymentMethod: 'bank_transfer',
      provider: 'Ecobank',
      failureReason: 'Insufficient funds',
      estimatedDelivery: 'Failed'
    }
  ];
  
  localStorage.setItem(TRANSACTIONS_STORE_KEY, JSON.stringify(mockTransactions));
  return mockTransactions;
};
