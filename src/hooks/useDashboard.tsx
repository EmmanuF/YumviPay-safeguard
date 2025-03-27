
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
            id: "tx_123456",
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
            totalAmount: "256.74",
            type: "send" // Added type for backward compatibility
          },
          {
            id: "tx_123457",
            amount: "200.00",
            fee: "4.49",
            recipientId: "rec2",
            recipientName: "Mary Johnson",
            recipientContact: "+233 55 123 4567",
            paymentMethod: "bank_transfer",
            provider: "ecobank",
            country: "GH",
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
            estimatedDelivery: "1-2 business days",
            totalAmount: "204.49",
            type: "send" // Added type for backward compatibility
          },
        ];
        
        setTransactions(mockTransactions);
        
        // Removed the setTimeout that was triggering continuous transaction updates
        
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
