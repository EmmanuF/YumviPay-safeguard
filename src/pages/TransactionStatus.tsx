
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionById, Transaction, updateTransactionStatus } from '@/services/transactions';
import { useNotifications } from '@/contexts/NotificationContext';
import Header from '@/components/Header';
import HeaderRight from '@/components/HeaderRight';
import BottomNavigation from '@/components/BottomNavigation';
import TransactionReceipt from '@/components/transaction/TransactionReceipt';
import StatusUpdateBar from '@/components/transaction/StatusUpdateBar';
import {
  LoadingState,
  TransactionNotFound,
  ActionButtons
} from '@/components/transaction';
import { toast } from '@/hooks/use-toast';

const TransactionStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  useEffect(() => {
    // Fetch transaction details
    const fetchTransactionDetails = () => {
      setLoading(true);
      
      if (!id) {
        setLoading(false);
        return;
      }
      
      const fetchedTransaction = getTransactionById(id);
      setTransaction(fetchedTransaction || null);
      setLoading(false);
      
      // Add notification for completed transactions
      if (fetchedTransaction && fetchedTransaction.status === 'completed') {
        addNotification({
          title: "Transfer Successful",
          message: `Your transfer of $${fetchedTransaction.amount} to ${fetchedTransaction.recipientName} was successful.`,
          type: 'success',
          transactionId: fetchedTransaction.id
        });
        
        // Clear any refresh interval once transaction is completed
        if (refreshInterval) {
          clearInterval(refreshInterval);
          setRefreshInterval(null);
        }
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
    
    // Clean up the interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [id, addNotification, refreshInterval, transaction?.status]);

  const handleShareTransaction = () => {
    // In a real app, this would trigger native sharing
    if (navigator.share && transaction) {
      navigator.share({
        title: `Yumvi Pay Transfer - ${transaction.id}`,
        text: `I sent $${transaction.amount} to ${transaction.recipientName} in ${transaction.country}`,
        url: window.location.href
      }).catch(error => {
        console.log('Error sharing:', error);
      });
    } else {
      toast({
        title: "Share",
        description: "Transaction receipt link copied to clipboard!",
      });
    }
  };

  const handleDownloadReceipt = () => {
    // In a mobile app, this would trigger download to device storage
    toast({
      title: "Download",
      description: "Receipt downloaded to your device",
    });
  };

  const handleSendAgain = () => {
    if (!transaction) return;
    
    navigate('/send', {
      state: {
        selectedRecipient: {
          id: transaction.recipientId,
          name: transaction.recipientName,
          contact: transaction.recipientContact,
          country: transaction.country,
          isFavorite: false
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header 
          title="Transaction" 
          showBackButton={true} 
          rightContent={<HeaderRight showNotification />} 
        />
        <LoadingState />
        <BottomNavigation />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header 
          title="Transaction" 
          showBackButton={true} 
          rightContent={<HeaderRight showNotification />} 
        />
        <TransactionNotFound />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Transaction Receipt" 
        showBackButton={true} 
        rightContent={<HeaderRight showNotification />} 
      />
      
      <div className="flex-1 p-4 pb-20">
        <TransactionReceipt 
          transaction={transaction}
          onShare={handleShareTransaction}
          onDownload={handleDownloadReceipt}
        />
        
        {(transaction.status === 'pending' || transaction.status === 'processing') && (
          <div className="mt-4">
            <StatusUpdateBar 
              transactionId={transaction.id}
              variant="default"
            />
          </div>
        )}
        
        <div className="mt-6">
          <ActionButtons 
            handleShareTransaction={handleShareTransaction} 
            handleSendAgain={handleSendAgain}
            transactionStatus={transaction.status}
          />
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default TransactionStatus;
