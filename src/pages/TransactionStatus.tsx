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
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

const safeParseNumber = (value: string | number | undefined): number => {
  if (value === undefined) return 0;
  if (typeof value === 'number') return value;
  return parseFloat(value) || 0;
};

const TRANSACTION_LOADING_TIMEOUT = 15000;

const TransactionStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
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

  const fetchTransactionDetails = async () => {
    if (!id) {
      setLoading(false);
      setError("No transaction ID provided");
      return;
    }
    
    try {
      console.log(`Fetching transaction details for ID: ${id}, retry attempt: ${retryCount}`);
      const fetchedTransaction = await getTransactionById(id);
      
      console.log(`Transaction fetched successfully:`, fetchedTransaction);
      setTransaction(fetchedTransaction);
      
      if (fetchedTransaction && fetchedTransaction.status === 'completed') {
        const amount = safeParseNumber(fetchedTransaction.amount);
          
        addNotification({
          title: "Transfer Successful",
          message: `Your transfer of $${amount} to ${fetchedTransaction.recipientName} was successful.`,
          type: 'success',
          transactionId: fetchedTransaction.id
        });
        
        if (refreshInterval) {
          clearInterval(refreshInterval);
          setRefreshInterval(null);
        }
      }
      
      setLoading(false);
      setError(null);
      
    } catch (error) {
      console.error('Error fetching transaction:', error);
      setError(error instanceof Error ? error.message : "Failed to load transaction data");
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
    
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setLoadingTimeout(null);
    }
    
    fetchTransactionDetails();
  };

  useEffect(() => {
    const startFetchWithTimeout = () => {
      setLoading(true);
      
      const timeout = setTimeout(() => {
        console.error(`Transaction loading timed out after ${TRANSACTION_LOADING_TIMEOUT}ms for ID: ${id}`);
        setLoading(false);
        setError("Loading transaction timed out. Please try refreshing the page.");
      }, TRANSACTION_LOADING_TIMEOUT);
      
      setLoadingTimeout(timeout);
      
      fetchTransactionDetails();
    };

    startFetchWithTimeout();
    
    if (transaction && (transaction.status === 'pending' || transaction.status === 'processing')) {
      if (!refreshInterval) {
        console.log(`Setting up refresh interval for transaction ${id}`);
        const interval = window.setInterval(() => {
          fetchTransactionDetails();
        }, 3000);
        
        setRefreshInterval(interval);
      }
    }
    
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [id, refreshInterval, transaction?.status]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <TransactionStatusHeader />
        <LoadingState 
          retryAction={retryCount < 3 ? handleRetry : undefined}
          submessage={retryCount > 0 ? `Retry attempt ${retryCount}/3...` : undefined}
        />
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
              <div className="space-y-2">
                {retryCount < 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleRetry}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                )}
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={handleGoHome}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
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
        <TransactionNotFound onRetry={handleRetry} />
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
