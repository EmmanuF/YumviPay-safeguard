
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionById, Transaction, updateTransactionStatus } from '@/services/transactions';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNetwork } from '@/contexts/NetworkContext';
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
import { resendTransactionReceipt, ErrorDialog, handleApiError } from '@/utils/transactionUtils';

const TransactionStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { isOnline, isOffline } = useNetwork();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 3;

  useEffect(() => {
    // Fetch transaction details
    const fetchTransactionDetails = async () => {
      if (fetchAttempts >= MAX_FETCH_ATTEMPTS) {
        setError("Maximum fetch attempts reached. Please try again later.");
        setShowErrorDialog(true);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      if (!id) {
        setError("Transaction ID is missing. Please check your URL.");
        setShowErrorDialog(true);
        setLoading(false);
        return;
      }
      
      try {
        const fetchedTransaction = getTransactionById(id);
        
        if (!fetchedTransaction) {
          setError("Transaction not found. It may have been deleted or never existed.");
          setLoading(false);
          return;
        }
        
        setTransaction(fetchedTransaction);
        
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
      } catch (error) {
        console.error("Error fetching transaction:", error);
        setError(handleApiError(error));
        setFetchAttempts(prev => prev + 1);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
    
    // For pending transactions, start a refresh interval to check for updates
    if (transaction && (transaction.status === 'pending' || transaction.status === 'processing')) {
      // Only set up the interval if it doesn't exist yet and if we're online
      if (!refreshInterval && isOnline) {
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
  }, [id, addNotification, refreshInterval, transaction?.status, isOnline, fetchAttempts]);

  // Reset refresh interval when coming back online
  useEffect(() => {
    if (isOnline && transaction && (transaction.status === 'pending' || transaction.status === 'processing') && !refreshInterval) {
      const interval = window.setInterval(() => {
        // Refetch transaction details when we come back online
        const fetchedTransaction = getTransactionById(id || '');
        if (fetchedTransaction) {
          setTransaction(fetchedTransaction);
          
          if (fetchedTransaction.status === 'completed') {
            clearInterval(interval);
            setRefreshInterval(null);
          }
        }
      }, 5000);
      
      setRefreshInterval(interval);
    } else if (isOffline && refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [isOnline, isOffline, transaction]);

  const handleShareTransaction = () => {
    // Check if offline
    if (!isOnline && !navigator.share) {
      toast({
        title: "Offline",
        description: "Cannot share while offline. Please check your connection.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would trigger native sharing
    if (navigator.share && transaction) {
      navigator.share({
        title: `Yumvi Pay Transfer - ${transaction.id}`,
        text: `I sent $${transaction.amount} to ${transaction.recipientName} in ${transaction.country}`,
        url: window.location.href
      }).catch(error => {
        console.log('Error sharing:', error);
        toast({
          title: "Share Failed",
          description: "Could not share the transaction. Please try again.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback for browsers without Web Share API
      try {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Share",
          description: "Transaction receipt link copied to clipboard!",
        });
      } catch (error) {
        console.error("Clipboard write failed:", error);
        toast({
          title: "Copy Failed",
          description: "Could not copy to clipboard. Please copy the URL manually.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownloadReceipt = () => {
    if (!transaction) {
      toast({
        title: "Error",
        description: "No transaction data available to download.",
        variant: "destructive",
      });
      return;
    }
    
    // In a mobile app, this would trigger download to device storage
    try {
      toast({
        title: "Download",
        description: "Receipt downloaded to your device",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Could not download the receipt. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSendAgain = () => {
    if (!transaction) {
      toast({
        title: "Error",
        description: "Transaction data not available.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "Cannot start a new transaction while offline.",
        variant: "destructive",
      });
      return;
    }
    
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
  
  const handleResendReceipt = async () => {
    if (!transaction || isResending) return;
    
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "Cannot resend receipt while offline. Please check your connection.",
        variant: "destructive",
      });
      return;
    }
    
    setIsResending(true);
    
    try {
      const success = await resendTransactionReceipt(transaction.id);
      
      if (success) {
        addNotification({
          title: "Receipt Sent",
          message: `Transaction receipt has been sent to ${transaction.recipientName}.`,
          type: 'success',
          transactionId: transaction.id
        });
      }
    } catch (error) {
      console.error('Error resending receipt:', error);
      const errorMessage = handleApiError(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const retryFetchTransaction = () => {
    setFetchAttempts(0);
    setError(null);
    setShowErrorDialog(false);
    
    // Re-trigger the useEffect
    setLoading(true);
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

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header 
          title="Transaction" 
          showBackButton={true} 
          rightContent={<HeaderRight showNotification />} 
        />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Transaction</h2>
          <p className="text-muted-foreground text-center mb-6">{error}</p>
          <Button onClick={retryFetchTransaction}>Try Again</Button>
        </div>
        <BottomNavigation />
        
        <ErrorDialog
          isOpen={showErrorDialog}
          setIsOpen={setShowErrorDialog}
          title="Transaction Error"
          description={error}
          actionText="Try Again"
          onAction={retryFetchTransaction}
        />
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
      
      <div className="flex-1 p-4 pb-20 overflow-auto">
        <TransactionReceipt 
          transaction={transaction}
          onShare={handleShareTransaction}
          onDownload={handleDownloadReceipt}
          onResend={handleResendReceipt}
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
            handleResendReceipt={handleResendReceipt}
            isResending={isResending}
            transactionStatus={transaction.status}
            isOnline={isOnline}
          />
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default TransactionStatus;
