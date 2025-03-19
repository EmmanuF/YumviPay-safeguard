
import { useMemo } from 'react';
import { Transaction } from '@/types/transaction';
import { format } from 'date-fns';

export const useTransactionAnalytics = (transactions: Transaction[]) => {
  // Transform transactions for monthly analysis
  const monthlyData = useMemo(() => {
    const last6Months = new Map<string, number>();
    
    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = format(d, 'MMM');
      last6Months.set(monthName, 0);
    }
    
    // Count transactions per month
    transactions.forEach(tx => {
      const txDate = tx.createdAt instanceof Date ? tx.createdAt : new Date(tx.createdAt);
      const monthName = format(txDate, 'MMM');
      
      if (last6Months.has(monthName)) {
        last6Months.set(monthName, (last6Months.get(monthName) || 0) + 1);
      }
    });
    
    // Convert map to array for chart
    return Array.from(last6Months).map(([month, count]) => ({
      month,
      count
    }));
  }, [transactions]);
  
  // Transform transactions for status analysis
  const statusData = useMemo(() => {
    const statusCounts = new Map<string, number>();
    
    transactions.forEach(tx => {
      statusCounts.set(tx.status, (statusCounts.get(tx.status) || 0) + 1);
    });
    
    return Array.from(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [transactions]);
  
  // Get status colors
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FFC107';
      case 'processing': return '#2196F3';
      case 'failed': return '#F44336';
      case 'cancelled': return '#9E9E9E';
      case 'offline-pending': return '#FF9800';
      default: return '#9c27b0';
    }
  };
  
  // Calculate total amount sent
  const totalAmountSent = useMemo(() => {
    return transactions
      .filter(tx => tx.status === 'completed')
      .reduce((sum, tx) => sum + (typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount), 0);
  }, [transactions]);
  
  // Get most frequent recipient
  const mostFrequentRecipient = useMemo(() => {
    const recipientCounts = new Map<string, number>();
    
    transactions.forEach(tx => {
      if (tx.recipientName) {
        recipientCounts.set(tx.recipientName, (recipientCounts.get(tx.recipientName) || 0) + 1);
      }
    });
    
    let maxCount = 0;
    let maxRecipient = '';
    
    recipientCounts.forEach((count, recipient) => {
      if (count > maxCount) {
        maxCount = count;
        maxRecipient = recipient;
      }
    });
    
    return { name: maxRecipient, count: maxCount };
  }, [transactions]);

  return {
    monthlyData,
    statusData,
    getStatusColor,
    totalAmountSent,
    mostFrequentRecipient
  };
};
