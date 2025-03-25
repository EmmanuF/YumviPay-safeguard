
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getTransactionById, Transaction } from '@/services/transactions';
import { updateTransactionStatus } from '@/services/transaction'; // Import directly from transaction service
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
import { toast } from 'sonner';

// Reduce timeout to improve user experience
const TRANSACTION_LOADING_TIMEOUT = 8000; // 8 seconds instead of 15
const MAX_RETRY_ATTEMPTS = 3;

const safeParseNumber = (value: string | number | undefined): number => {
  if (value === undefined) return 0;
  if (typeof value === 'number') return value;
  return parseFloat(value) || 0;
};

const TransactionStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotifications();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [forceRetry, setForceRetry] = useState(false);
  
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

  const fetchTransactionDetails = async (force = false) => {
    if (!id) {
      setLoading(false);
      setError("No transaction ID provided");
      return;
    }

    // Check if we have the transaction in localStorage as a fallback
    const storedTransaction = localStorage.getItem(`transaction_${id}`);
    
    try {
      console.log(`Fetching transaction details for ID: ${id}, retry attempt: ${retryCount}`);
      
      let fetchedTransaction: Transaction | null = null;
      
      try {
        fetchedTransaction = await getTransactionById(id);
        console.log(`Transaction fetched successfully:`, fetchedTransaction);
      } catch (fetchError) {
        console.error('Error fetching transaction from API:', fetchError);
        
        // Emergency fallback: Try to parse from localStorage if API fetch fails
        if (storedTransaction) {
          try {
            console.log('API fetch failed. Attempting to use localStorage fallback');
            const parsedTransaction = JSON.parse(storedTransaction);
            
            // Convert to proper Transaction format
            fetchedTransaction = {
              id: parsedTransaction.id || parsedTransaction.transactionId || id,
              amount: parsedTransaction.amount || '0',
              recipientName: parsedTransaction.recipientName || 'Unknown Recipient',
              recipientContact: parsedTransaction.recipientContact || '',
              country: parsedTransaction.country || 'CM',
              status: parsedTransaction.status || 'pending',
              createdAt: new Date(parsedTransaction.createdAt || new Date()),
              updatedAt: new Date(parsedTransaction.updatedAt || new Date()),
              completedAt: parsedTransaction.completedAt ? new Date(parsedTransaction.completedAt) : undefined,
              failureReason: parsedTransaction.failureReason,
              estimatedDelivery: parsedTransaction.estimatedDelivery || 'Processing',
              totalAmount: parsedTransaction.totalAmount || parsedTransaction.amount || '0',
              provider: parsedTransaction.provider || 'Unknown',
              paymentMethod: parsedTransaction.paymentMethod || 'mobile_money'
            };
            
            console.log('Successfully recovered transaction from localStorage:', fetchedTransaction);
          } catch (parseError) {
            console.error('Error parsing localStorage transaction:', parseError);
          }
        }
      }
      
      if (fetchedTransaction) {
        setTransaction(fetchedTransaction);
        
        if (fetchedTransaction.status === 'completed') {
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
        
        // If transaction is stuck in pending state for too long, force to processing
        if (force && fetchedTransaction.status === 'pending' && retryCount > 1) {
          console.log('Transaction appears stuck in pending, forcing to processing state');
          try {
            await updateTransactionStatus(id, 'processing');
            
            // Force another fetch after a short delay
            setTimeout(() => {
              setForceRetry(true);
            }, 1500);
          } catch (updateError) {
            console.error('Error forcing transaction status update:', updateError);
          }
        }
        
        setLoading(false);
        setError(null);
      } else {
        throw new Error('Transaction data could not be retrieved');
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
      setError(error instanceof Error ? error.message : "Failed to load transaction data");
      
      // After max retries, try to force create a transaction if we have data in localStorage
      if (retryCount >= MAX_RETRY_ATTEMPTS && storedTransaction) {
        try {
          console.log('Maximum retries reached. Attempting to recover transaction from localStorage');
          const parsedTransaction = JSON.parse(storedTransaction);
          
          // Create a minimal valid transaction object
          const recoveredTransaction: Transaction = {
            id: id,
            amount: parsedTransaction.amount || '0',
            recipientName: parsedTransaction.recipientName || 'Unknown Recipient',
            recipientContact: parsedTransaction.recipientContact || '',
            country: parsedTransaction.country || 'CM',
            status: parsedTransaction.status || 'completed',
            createdAt: new Date(parsedTransaction.createdAt || new Date()),
            updatedAt: new Date(parsedTransaction.updatedAt || new Date()),
            completedAt: new Date(),
            estimatedDelivery: 'Delivered',
            totalAmount: parsedTransaction.amount || '0',
            provider: parsedTransaction.provider || 'MTN Mobile Money',
            paymentMethod: parsedTransaction.paymentMethod || 'mobile_money'
          };
          
          console.log('Created recovery transaction:', recoveredTransaction);
          setTransaction(recoveredTransaction);
          setError(null);
          
          // Show recovery toast
          toast.success("Transaction Recovered", {
            description: "We've recovered your transaction information"
          });
        } catch (recoveryError) {
          console.error('Error recovering transaction from localStorage:', recoveryError);
        }
      }
      
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
    
    // Force status update on retry
    fetchTransactionDetails(true);
  };

  useEffect(() => {
    // Check if transaction ID is from URL state (after fresh redirect)
    if (location.state && location.state.transactionId && !id) {
      console.log('Found transaction ID in location state:', location.state.transactionId);
      navigate(`/transaction/${location.state.transactionId}`, { replace: true });
      return;
    }
    
    const startFetchWithTimeout = () => {
      setLoading(true);
      
      const timeout = setTimeout(() => {
        console.error(`Transaction loading timed out after ${TRANSACTION_LOADING_TIMEOUT}ms for ID: ${id}`);
        
        if (retryCount < MAX_RETRY_ATTEMPTS) {
          console.log(`Automatically retrying after timeout (${retryCount + 1}/${MAX_RETRY_ATTEMPTS})...`);
          setRetryCount(prev => prev + 1);
          fetchTransactionDetails(true);
        } else {
          setLoading(false);
          setError("Loading transaction timed out. Please try refreshing the page.");
        }
      }, TRANSACTION_LOADING_TIMEOUT);
      
      setLoadingTimeout(timeout);
      
      fetchTransactionDetails();
    };

    startFetchWithTimeout();
    
    // Force a refresh if transaction is still pending after 10 seconds
    const pendingStatusTimeout = setTimeout(() => {
      if (transaction && (transaction.status === 'pending')) {
        console.log('Transaction still pending after extended time, forcing refresh');
        handleRetry();
      }
    }, 10000);
    
    // If transaction exists and is pending or processing, set up refresh interval
    if (transaction && (transaction.status === 'pending' || transaction.status === 'processing')) {
      if (!refreshInterval) {
        console.log(`Setting up refresh interval for transaction ${id}`);
        const interval = window.setInterval(() => {
          fetchTransactionDetails();
        }, 3000);
        
        setRefreshInterval(interval);
      }
    }
    
    // Handle force retry flag
    if (forceRetry) {
      console.log('Handling forced retry');
      fetchTransactionDetails(true);
      setForceRetry(false);
    }
    
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      clearTimeout(pendingStatusTimeout);
    };
  }, [id, refreshInterval, transaction?.status, retryCount, forceRetry, location.state, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <TransactionStatusHeader />
        <LoadingState 
          retryAction={retryCount < MAX_RETRY_ATTEMPTS ? handleRetry : undefined}
          submessage={retryCount > 0 ? `Retry attempt ${retryCount}/${MAX_RETRY_ATTEMPTS}...` : undefined}
        />
        <BottomNavigation />
      </div>
    );
  }

  if (error && !transaction) {
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
                {retryCount < MAX_RETRY_ATTEMPTS && (
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
