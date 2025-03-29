import { useState, useEffect, useCallback } from 'react';
import { 
  Transaction, 
  TransactionStatus
} from '@/types/transaction';
import {
  getAllTransactions,
  getRecentTransactions,
  getTransactionById,
  updateTransactionStatus,
  initializeTransactions
} from '@/services/transaction';
import { useToast } from '@/hooks/use-toast';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize transactions if needed
  useEffect(() => {
    const init = async () => {
      try {
        await initializeTransactions();
      } catch (error) {
        console.error('Failed to initialize transactions:', error);
      }
    };
    
    init();
  }, []);

  // Load transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Get a single transaction by ID
  const getTransaction = async (id: string) => {
    return await getTransactionById(id);
  };

  // Get recent transactions
  const getRecentTransactions = async () => {
    return await getRecentTransactions();
  };

  // Update transaction status
  const updateStatus = async (
    id: string, 
    status: TransactionStatus, 
    options?: { 
      completedAt?: Date; 
      failureReason?: string; 
    }
  ) => {
    const updated = await updateTransactionStatus(id, status, options);
    if (updated) {
      // Refresh the transactions list
      await fetchTransactions();
      return updated;
    }
    return null;
  };

  return {
    transactions,
    loading,
    getTransaction,
    getRecentTransactions,
    updateStatus,
    refreshTransactions: fetchTransactions,
  };
};
