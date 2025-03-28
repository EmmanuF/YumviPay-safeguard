
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
        // Set longer timeout to give time for navigation
        console.log('Dashboard is being redirected to history page...');
        
        // Redirect to history page with a small delay
        setTimeout(() => {
          navigate('/history', { replace: true });
        }, 100);
        
        return;
      } catch (error) {
        console.error('Error redirecting from dashboard:', error);
        setIsLoading(false);
      }
    };
    
    loadUserData();
    
    // Cleanup function
    return () => {
      setIsLoading(false);
    };
  }, [navigate, addNotification, authUser, isLoggedIn]);
  
  return {
    user,
    isLoading,
    transactions
  };
};
