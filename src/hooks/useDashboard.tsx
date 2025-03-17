
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '@/types/transaction';
import { getAuthState } from '@/services/auth';
import { useNotifications } from '@/contexts/NotificationContext';

export const useDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { user, isAuthenticated } = await getAuthState();
        
        if (!isAuthenticated) {
          navigate('/');
          return;
        }
        
        setUser(user);
        
        // Mock transaction data for demo purposes
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
        ];
        
        setTransactions(mockTransactions);
        
        // Simulate receiving a transaction status update
        setTimeout(() => {
          addNotification({
            title: 'Transaction Update',
            message: 'Your transfer of $200 to Sarah Johnson is processing.',
            type: 'info',
            transactionId: 'tx_123457'
          });
        }, 3000);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate, addNotification]);
  
  return {
    user,
    isLoading,
    transactions
  };
};
