
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

// Utility function to safely parse a number
const safeParseNumber = (value: string | number | undefined): number => {
  if (value === undefined) return 0;
  if (typeof value === 'number') return value;
  return parseFloat(value) || 0;
};

// Max time to wait for transaction loading in milliseconds
const TRANSACTION_LOADING_TIMEOUT = 15000; // 15 seconds

const TransactionStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const {
    sendingNotification,
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
        setError("No transaction ID provided");
        return;
      }
      
      // Set a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        console.error(`Transaction loading timed out after ${TRANSACTION_LOADING_TIMEOUT}ms for ID: ${id}`);
        setLoading(false);
        setError("Loading transaction timed out. Please try refreshing the page.");
      }, TRANSACTION_LOADING_TIMEOUT);
      
      setLoadingTimeout(timeout);
      
      try {
        console.log(`Fetching transaction details for ID: ${id}`);
        // Now properly awaiting the async function
        const fetchedTransaction = await getTransactionById(id);
        
        // Clear the timeout since we got the data
        clearTimeout(timeout);
        setLoadingTimeout(null);
        
        console.log(`Transaction fetched successfully:`, fetchedTransaction);
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
        // Clear the timeout if there's an error
        clearTimeout(timeout);
        setLoadingTimeout(null);
        
        console.error('Error fetching transaction:', error);
        setError(error instanceof Error ? error.message : "Failed to load transaction data");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
    
    // For pending transactions, start a refresh interval to check for updates
    if (transaction && (transaction.status === 'pending' || transaction.status === 'processing')) {
      // Only set up the interval if it doesn't exist yet
      if (!refreshInterval) {
        console.log(`Setting up refresh interval for transaction ${id}`);
        const interval = window.setInterval(() => {
          fetchTransactionDetails();
        }, 5000); // Check every 5 seconds
        
        setRefreshInterval(interval);
      }
    }
    
    // Clean up the timeout and interval when component unmounts
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [id, addNotification, refreshInterval, transaction?.status, setRefreshInterval]);

  // Handle go back to home
  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <TransactionStatusHeader />
        <LoadingState />
        <BottomNavigation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <TransactionStatusHeader />
        <div className="flex-1 p-4 flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Error Loading Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Failed to load transaction</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <p className="mb-4 text-sm text-muted-foreground">
                This could be due to network issues or the transaction may not exist. Please try again later.
              </p>
              <Button 
                variant="default" 
                className="w-full" 
                onClick={handleGoHome}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
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
        generatingReceipt={generatingReceipt}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default TransactionStatus;
