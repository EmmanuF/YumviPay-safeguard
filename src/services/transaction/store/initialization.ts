
import { Transaction } from "@/types/transaction";
import { setOfflineTransactions } from './storageOperations';

// In-memory storage for transactions when no LocalStorage is available
let inMemoryTransactions: Transaction[] = [];

// Initialize transactions from localStorage or create mock data
export const initializeTransactions = (): Transaction[] => {
  try {
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedTransactions) {
      // Parse stored transactions, ensuring dates are properly converted
      const parsedTransactions = JSON.parse(storedTransactions);
      return parsedTransactions.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        completedAt: t.completedAt ? new Date(t.completedAt) : undefined
      }));
    }
    
    // Generate mock data if nothing in localStorage
    console.log('No transactions found in localStorage, generating mock data');
    const mockTransactions = generateMockTransactions();
    setOfflineTransactions(mockTransactions);
    return mockTransactions;
  } catch (error) {
    console.error('Error initializing transactions:', error);
    
    // Generate mock data if there's an error
    console.log('Error with localStorage, using in-memory mock data');
    const mockTransactions = generateMockTransactions();
    inMemoryTransactions = mockTransactions;
    return mockTransactions;
  }
};

// Generate mock transactions for testing
export const generateMockTransactions = (): Transaction[] => {
  return [
    {
      id: 'YM1RD5TA',
      amount: '150.00',
      recipientName: 'John Doe',
      recipientContact: '+237 650123456',
      country: 'CM',
      status: 'completed',
      paymentMethod: 'mobile_money',
      provider: 'MTN Mobile Money',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      estimatedDelivery: 'Delivered',
      totalAmount: '150.00'
    },
    {
      id: 'YM2RD5TB',
      amount: '75.50',
      recipientName: 'Jane Smith',
      recipientContact: '+237 677654321',
      country: 'CM',
      status: 'processing',
      paymentMethod: 'bank_transfer',
      provider: 'Ecobank',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      estimatedDelivery: '1-2 business days',
      totalAmount: '75.50'
    },
    {
      id: 'YM3RD5TC',
      amount: '200.00',
      recipientName: 'Robert Johnson',
      recipientContact: '+237 699887766',
      country: 'CM',
      status: 'failed',
      paymentMethod: 'mobile_money',
      provider: 'Orange Money',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      estimatedDelivery: 'Failed',
      failureReason: 'Insufficient funds',
      totalAmount: '200.00'
    }
  ];
};

// Export the in-memory transactions for internal module use
export { inMemoryTransactions };
