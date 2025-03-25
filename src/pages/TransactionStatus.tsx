
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
const TRANSACTION_LOADING_TIMEOUT = 4000; // Reduced from 8s to 4s
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

    console.log(`Attempting to fetch transaction ${id} (attempt ${retryCount + 1})`);
    
    // CRITICAL FIX: First check localStorage directly before trying API calls
    // This ensures we retrieve locally stored transactions even during network issues
    const localStorageKey = `transaction_${id}`;
    const storedTransaction = localStorage.getItem(localStorageKey);
    
    if (storedTransaction) {
      try {
        console.log(`Found transaction in localStorage with key: ${localStorageKey}`);
        const parsedTransaction = JSON.parse(storedTransaction);
        console.log('Parsed transaction from localStorage:', parsedTransaction);
        
        // Convert to proper Transaction format
        const localTransaction: Transaction = {
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
        
        // Set transaction directly from localStorage
        setTransaction(localTransaction);
        setLoading(false);
        setError(null);
        
        // If transaction is completed, add notification
        if (localTransaction.status === 'completed') {
          const amount = safeParseNumber(localTransaction.amount);
          
          addNotification({
            title: "Transfer Successful",
            message: `Your transfer of $${amount} to ${localTransaction.recipientName} was successful.`,
            type: 'success',
            transactionId: localTransaction.id
          });
          
          if (refreshInterval) {
            clearInterval(refreshInterval);
            setRefreshInterval(null);
          }
        }
        
        // If we found a transaction in localStorage, return early - don't try API
        return;
      } catch (parseError) {
        console.error(`Error parsing localStorage transaction ${id}:`, parseError);
        // If parsing fails, continue to API call
      }
    } else {
      console.log(`No transaction found in localStorage with key: ${localStorageKey}`);
    }
    
    // If we reach here, we didn't find a valid transaction in localStorage
    try {
      console.log(`Fetching transaction details for ID: ${id} from API, retry attempt: ${retryCount}`);
      
      let fetchedTransaction: Transaction | null = null;
      
      try {
        fetchedTransaction = await getTransactionById(id);
        console.log(`Transaction fetched successfully from API:`, fetchedTransaction);
      } catch (fetchError) {
        console.error('Error fetching transaction from API:', fetchError);
        
        // If API fetch fails, we've already checked localStorage earlier
        // Just throw the error to move to the catch block
        throw fetchError;
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
            }, 1000);
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
      
      // We already tried localStorage at the start of this function
      // If we still don't have a transaction, we need to handle the error
      setError(error instanceof Error ? error.message : "Failed to load transaction data");
      
      // After max retries, create a fallback transaction if we still have nothing
      if (retryCount >= MAX_RETRY_ATTEMPTS && !transaction) {
        try {
          console.log('Maximum retries reached. Creating fallback transaction');
          
          // Create a minimal valid transaction object as fallback
          const recoveredTransaction: Transaction = {
            id: id,
            amount: '0',
            recipientName: 'Unknown Recipient',
            recipientContact: '',
            country: 'CM',
            status: 'pending' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
            estimatedDelivery: 'Processing',
            totalAmount: '0',
            provider: 'Unknown',
            paymentMethod: 'mobile_money'
          };
          
          console.log('Created fallback transaction:', recoveredTransaction);
          setTransaction(recoveredTransaction);
          setError(null);
          
          // Show recovery toast
          toast.info("Transaction Created", {
            description: "We've created a transaction record. Please check its status."
          });
        } catch (recoveryError) {
          console.error('Error creating fallback transaction:', recoveryError);
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
          setError("Loading transaction timed out. Check your network connection and try again.");
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
    }, 5000); // Reduced from 10s to 5s for faster feedback
    
    // If transaction exists and is pending or processing, set up refresh interval
    if (transaction && (transaction.status === 'pending' || transaction.status === 'processing')) {
      if (!refreshInterval) {
        console.log(`Setting up refresh interval for transaction ${id}`);
        const interval = window.setInterval(() => {
          fetchTransactionDetails();
        }, 2000); // Reduced from 3s to 2s for more responsive updates
        
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
