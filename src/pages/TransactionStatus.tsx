
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getTransactionById, Transaction } from '@/services/transactions';
import { updateTransactionStatus } from '@/services/transaction'; 
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
const TRANSACTION_LOADING_TIMEOUT = 4000; // 4 seconds
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

  // New helper function to directly check localStorage for transaction
  const getLocalStorageTransaction = (transactionId: string): Transaction | null => {
    try {
      const transactionKey = `transaction_${transactionId}`;
      console.log(`Directly checking localStorage for key: ${transactionKey}`);
      
      const storedData = localStorage.getItem(transactionKey);
      if (!storedData) {
        console.log(`No transaction found in localStorage with key: ${transactionKey}`);
        return null;
      }
      
      console.log(`Found transaction data in localStorage: ${storedData.substring(0, 50)}...`);
      const parsedData = JSON.parse(storedData);
      
      // Convert to proper Transaction format
      return {
        id: parsedData.id || parsedData.transactionId || transactionId,
        amount: parsedData.amount || '0',
        recipientName: parsedData.recipientName || 'Unknown Recipient',
        recipientContact: parsedData.recipientContact || '',
        country: parsedData.country || 'CM',
        status: parsedData.status || 'pending',
        createdAt: new Date(parsedData.createdAt || new Date()),
        updatedAt: new Date(parsedData.updatedAt || new Date()),
        completedAt: parsedData.completedAt ? new Date(parsedData.completedAt) : undefined,
        failureReason: parsedData.failureReason,
        estimatedDelivery: parsedData.estimatedDelivery || 'Processing',
        totalAmount: parsedData.totalAmount || parsedData.amount || '0',
        provider: parsedData.provider || 'Unknown',
        paymentMethod: parsedData.paymentMethod || 'mobile_money'
      };
    } catch (error) {
      console.error(`Error retrieving transaction from localStorage:`, error);
      return null;
    }
  };

  const fetchTransactionDetails = async (force = false) => {
    if (!id) {
      setLoading(false);
      setError("No transaction ID provided");
      return;
    }

    console.log(`Attempting to fetch transaction ${id} (attempt ${retryCount + 1})`);
    
    // CRITICAL FIX: Check localStorage first before any API calls
    const localTransaction = getLocalStorageTransaction(id);
    
    if (localTransaction) {
      console.log(`Successfully retrieved transaction ${id} from localStorage:`, localTransaction);
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
      
      // If transaction is pending or processing and we're forcing a refresh,
      // try to move it along in the background
      if (force && (localTransaction.status === 'pending' || localTransaction.status === 'processing')) {
        console.log(`Transaction ${id} is ${localTransaction.status}, attempting to update status in background`);
        
        try {
          // Don't await this - let it update in the background
          updateTransactionStatus(id, 'processing').catch(console.error);
          
          // Try the webhook simulation again
          const { simulateKadoWebhook } = await import('@/services/transaction/transactionUpdate');
          simulateKadoWebhook(id).catch(console.error);
        } catch (updateError) {
          console.error('Background status update error:', updateError);
        }
      }
      
      // Return early since we found a valid transaction
      return;
    }
    
    // If we get here, we didn't find the transaction in localStorage
    console.log(`Transaction ${id} not found in localStorage, trying API`);
    
    try {
      console.log(`Fetching transaction details for ID: ${id} from API, retry attempt: ${retryCount}`);
      
      let fetchedTransaction: Transaction | null = null;
      
      try {
        fetchedTransaction = await getTransactionById(id);
        console.log(`Transaction fetched successfully from API:`, fetchedTransaction);
      } catch (fetchError) {
        console.error('Error fetching transaction from API:', fetchError);
        throw fetchError;
      }
      
      if (fetchedTransaction) {
        setTransaction(fetchedTransaction);
        
        // Also update localStorage for future reference
        localStorage.setItem(`transaction_${id}`, JSON.stringify({
          ...fetchedTransaction,
          createdAt: fetchedTransaction.createdAt.toISOString(),
          updatedAt: fetchedTransaction.updatedAt.toISOString(),
          completedAt: fetchedTransaction.completedAt ? fetchedTransaction.completedAt.toISOString() : undefined
        }));
        
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
          
          // Store it in localStorage for future reference
          localStorage.setItem(`transaction_${id}`, JSON.stringify({
            ...recoveredTransaction,
            createdAt: recoveredTransaction.createdAt.toISOString(),
            updatedAt: recoveredTransaction.updatedAt.toISOString()
          }));
          
          // Show recovery toast
          toast.info("Transaction Created", {
            description: "We've created a transaction record. Please check its status."
          });
        } catch (recoveryError) {
          console.error('Error creating fallback transaction:', recoveryError);
        }
      }
      
      setLoading(false);
      setError(error instanceof Error ? error.message : "Failed to load transaction data");
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
    
    // Force a refresh if transaction is still pending after 5 seconds
    const pendingStatusTimeout = setTimeout(() => {
      if (transaction && (transaction.status === 'pending')) {
        console.log('Transaction still pending after extended time, forcing refresh');
        handleRetry();
      }
    }, 5000);
    
    // If transaction exists and is pending or processing, set up refresh interval
    if (transaction && (transaction.status === 'pending' || transaction.status === 'processing')) {
      if (!refreshInterval) {
        console.log(`Setting up refresh interval for transaction ${id}`);
        const interval = window.setInterval(() => {
          fetchTransactionDetails();
        }, 2000); // 2 second refresh interval
        
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
