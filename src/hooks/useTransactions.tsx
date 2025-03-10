
import { useState, useEffect, useCallback } from 'react';
import { 
  Transaction, 
  TransactionStatus
} from '@/types/transaction';
import {
  getAllTransactions,
  getRecentTransactions as getRecentTxs,
  getTransactionById,
  updateTransactionStatus,
  initializeMockTransactions
} from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize transactions if needed
  useEffect(() => {
    initializeMockTransactions();
  }, []);

  // Load transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = getAllTransactions();
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
  const getTransaction = (id: string) => {
    return getTransactionById(id);
  };

  // Get recent transactions
  const getRecentTransactions = (limit: number = 5) => {
    return getRecentTxs(limit);
  };

  // Update transaction status
  const updateStatus = (id: string, status: TransactionStatus, failureReason?: string) => {
    const updated = updateTransactionStatus(id, status, failureReason);
    if (updated) {
      // Refresh the transactions list
      fetchTransactions();
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
