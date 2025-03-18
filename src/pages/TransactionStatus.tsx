import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTransactionById, Transaction } from '@/services/transactions';
import { useNotifications } from '@/contexts/NotificationContext';
import BottomNavigation from '@/components/BottomNavigation';
import {
  LoadingState,
  TransactionNotFound,
  TransactionStatusHeader,
  TransactionStatusContent
} from '@/components/transaction';
import { useTransactionReceipt } from '@/hooks/useTransactionReceipt';

// Utility function to safely parse a number
const safeParseNumber = (value: string | number | undefined): number => {
  if (value === undefined) return 0;
  if (typeof value === 'number') return value;
  return parseFloat(value) || 0;
};

const TransactionStatus = () => {
  const { id } = useParams<{ id: string }>();
  const { addNotification } = useNotifications();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  
  const {
    sendingNotification,
    notificationType,
    generatingReceipt,
    refreshInterval,
    setRefreshInterval,
    handleShareTransaction,
    handleDownloadReceipt,
    handleSendAgain,
    handleSendEmailReceipt,
    handleSendSmsNotification
  } = useTransactionReceipt(transaction);

  useEffect(() => {
    // Fetch transaction details
    const fetchTransactionDetails = async () => {
      setLoading(true);
      
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        // Now properly awaiting the async function
        const fetchedTransaction = await getTransactionById(id);
        setTransaction(fetchedTransaction);
        
        // Add notification for completed transactions
        if (fetchedTransaction && fetchedTransaction.status === 'completed') {
          // Convert amount to number for notification
          const amount = safeParseNumber(fetchedTransaction.amount);
            
          addNotification({
            title: "Transfer Successful",
            message: `Your transfer of $${amount} to ${fetchedTransaction.recipientName} was successful.`,
            type: 'success',
            transactionId: fetchedTransaction.id
          });
          
          // Clear any refresh interval once transaction is completed
          if (refreshInterval) {
            clearInterval(refreshInterval);
            setRefreshInterval(null);
          }
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
    
    // For pending transactions, start a refresh interval to check for updates
    if (transaction && (transaction.status === 'pending' || transaction.status === 'processing')) {
      // Only set up the interval if it doesn't exist yet
      if (!refreshInterval) {
        const interval = window.setInterval(() => {
          fetchTransactionDetails();
        }, 5000); // Check every 5 seconds
        
        setRefreshInterval(interval);
      }
    }
    
  }, [id, addNotification, refreshInterval, transaction?.status, setRefreshInterval]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <TransactionStatusHeader />
        <LoadingState />
        <BottomNavigation />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <TransactionStatusHeader />
        <TransactionNotFound />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TransactionStatusHeader />
      
      <TransactionStatusContent
        transaction={transaction}
        onShare={handleShareTransaction}
        onDownload={handleDownloadReceipt}
        onSendAgain={handleSendAgain}
        onSendEmail={handleSendEmailReceipt}
        onSendSms={handleSendSmsNotification}
        sendingNotification={sendingNotification}
        notificationType={notificationType}
        generatingReceipt={generatingReceipt}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default TransactionStatus;
