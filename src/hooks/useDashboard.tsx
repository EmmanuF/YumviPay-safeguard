
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '@/types/transaction';
import { useAuth } from '@/contexts/auth';
import { useNotifications } from '@/contexts/NotificationContext';

export const useDashboard = () => {
  const navigate = useNavigate();
  const { user: authUser, isLoggedIn } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('Dashboard is deprecated, redirecting to history...');
        
        // Redirect to history page
        navigate('/history', { replace: true });
        return;
      } catch (error) {
        console.error('Error redirecting from dashboard:', error);
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate, addNotification, authUser, isLoggedIn]);
  
  return {
    user,
    isLoading,
    transactions
  };
};
