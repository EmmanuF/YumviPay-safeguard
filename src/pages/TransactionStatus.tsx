
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionById, Transaction } from '@/services/transactions';
import { useNotifications } from '@/contexts/NotificationContext';
import Header from '@/components/Header';
import HeaderRight from '@/components/HeaderRight';
import {
  StatusContent,
  ActionButtons,
  LoadingState,
  TransactionNotFound,
  StatusUpdateBar,
  NotificationToggle
} from '@/components/transaction';

const TransactionStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

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
      }
    };

    fetchTransactionDetails();
  }, [id, addNotification]);

  // Helper function to format transaction for status content
  const formatTransactionForDisplay = (tx: Transaction) => {
    return {
      id: tx.id,
      status: tx.status,
      amount: tx.amount,
      fee: tx.fee,
      totalAmount: tx.totalAmount,
      recipient: `${tx.recipientName} (${tx.recipientContact})`,
      date: tx.createdAt.toLocaleDateString(),
      estimatedDelivery: tx.estimatedDelivery,
      failureReason: tx.failureReason
    };
  };

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
      alert('Transaction receipt link copied to clipboard!');
    }
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
      
      <div className="flex-1 p-4">
        <StatusContent transaction={formatTransactionForDisplay(transaction)} />
        
        <div className="mt-6">
          <ActionButtons 
            handleShareTransaction={handleShareTransaction} 
            handleSendAgain={handleSendAgain}
            transactionStatus={transaction.status}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
