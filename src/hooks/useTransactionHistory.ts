
import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading transaction data
    const fetchTransactions = async () => {
      try {
        // In a real app, we would fetch from an API
        // This is mock data for demonstration
        const mockTransactions: Transaction[] = [
          {
            id: 'tx_123456',
            amount: '500',
            currency: 'USD',
            recipientName: 'John Doe',
            recipientCountry: 'Nigeria',
            recipientCountryCode: 'NG',
            status: 'completed',
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            type: 'send',
            createdAt: new Date(Date.now() - 86400000),
            country: 'Nigeria',
            fee: '5.00',
            totalAmount: '505.00',
            recipientContact: '+234123456789',
            recipientId: 'rec_123456',
            paymentMethod: 'bank_transfer',
            estimatedDelivery: '1-2 business days'
          },
          {
            id: 'tx_123457',
            amount: '200',
            currency: 'USD',
            recipientName: 'Sarah Johnson',
            recipientCountry: 'Kenya',
            recipientCountryCode: 'KE',
            status: 'pending',
            date: new Date().toISOString(),
            type: 'send',
            createdAt: new Date(),
            country: 'Kenya',
            fee: '3.50',
            totalAmount: '203.50',
            recipientContact: '+254987654321',
            recipientId: 'rec_123457',
            paymentMethod: 'mobile_money',
            estimatedDelivery: '1-2 business days'
          },
          {
            id: 'tx_123458',
            amount: '350',
            currency: 'USD',
            recipientName: 'Michael Brown',
            recipientCountry: 'Ghana',
            recipientCountryCode: 'GH',
            status: 'completed',
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            type: 'send',
            createdAt: new Date(Date.now() - 172800000),
            country: 'Ghana',
            fee: '4.25',
            totalAmount: '354.25',
            recipientContact: '+233123456789',
            recipientId: 'rec_123458',
            paymentMethod: 'bank_transfer',
            estimatedDelivery: '1-2 business days'
          },
          {
            id: 'tx_123459',
            amount: '100',
            currency: 'USD',
            recipientName: 'Emma Wilson',
            recipientCountry: 'Cameroon',
            recipientCountryCode: 'CM',
            status: 'failed',
            date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            type: 'send',
            createdAt: new Date(Date.now() - 259200000),
            country: 'Cameroon',
            fee: '2.50',
            totalAmount: '102.50',
            recipientContact: '+237123456789',
            recipientId: 'rec_123459',
            paymentMethod: 'mobile_money',
            estimatedDelivery: '1-2 business days',
            failureReason: 'Payment authorization failed'
          },
          {
            id: 'tx_123460',
            amount: '150',
            currency: 'USD',
            recipientName: 'James Taylor',
            recipientCountry: 'South Africa',
            recipientCountryCode: 'ZA',
            status: 'completed',
            date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            type: 'send',
            createdAt: new Date(Date.now() - 432000000),
            country: 'South Africa',
            fee: '3.00',
            totalAmount: '153.00',
            recipientContact: '+27123456789',
            recipientId: 'rec_123460',
            paymentMethod: 'bank_transfer',
            estimatedDelivery: '1-2 business days'
          },
        ];
        
        setTransactions(mockTransactions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  const handleTransactionClick = (transactionId: string) => {
    window.location.href = `/transaction/${transactionId}`;
  };
  
  return { 
    transactions,
    isLoading,
    handleTransactionClick
  };
}
