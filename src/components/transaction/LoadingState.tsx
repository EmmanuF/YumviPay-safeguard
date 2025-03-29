
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createFallbackTransaction } from '@/services/transaction';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  error?: string | Error | null;
  timeout?: number;
  onRetry?: () => void;
  retryAction?: () => void; // Added for backward compatibility
  transactionId?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  submessage,
  error = null,
  timeout = 1500, // Default to 1.5 seconds
  onRetry,
  retryAction, // Handle both prop names
  transactionId
}) => {
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [hasData, setHasData] = useState(false);
  const navigate = useNavigate();
  
  // Combine both retry handlers for backward compatibility
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (retryAction) {
      retryAction();
    } else {
      window.location.reload();
    }
  };
  
  // Check if we can recover transaction data
  useEffect(() => {
    if (transactionId) {
      // Try to recover transaction data from localStorage
      try {
        const hasStoredData = localStorage.getItem(`transaction_${transactionId}`) !== null;
        setHasData(hasStoredData);
      } catch (e) {
        console.error('Error checking transaction data:', e);
      }
    }
  }, [transactionId]);
  
  // Set timeout to show user options if loading takes too long
  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => {
        setTimeoutReached(true);
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [timeout]);
  
  // Emergency function to force complete a transaction
  const handleForceComplete = () => {
    if (!transactionId) {
      toast.error("No transaction ID available");
      return;
    }
    
    try {
      // Create a completed fallback transaction
      const fallback = createFallbackTransaction(transactionId);
      
      toast.success("Transaction Created", {
        description: "Your transaction has been marked as completed",
      });
      
      // Reload the current page to refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error forcing transaction completion:', error);
      toast.error("Error Updating Transaction");
    }
  };
  
  // Go to send money page
  const handleSendNew = () => {
    navigate('/transaction/new');
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error instanceof Error ? error.message : error.toString()}
        </p>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
          <Button onClick={handleSendNew}>
            Start New Transaction
          </Button>
        </div>
      </div>
    );
  }
  
  // Show options immediately for TXN- prefixed transactions
  const isTxnFormat = transactionId && transactionId.startsWith('TXN-');
  const showOptions = timeoutReached || isTxnFormat;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 min-h-[200px]"
    >
      {!showOptions ? (
        <>
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h3 className="text-lg font-semibold mb-2">{message}</h3>
          {submessage && <p className="text-sm text-muted-foreground">{submessage}</p>}
        </>
      ) : (
        <>
          <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isTxnFormat ? "Creating Your Transaction" : "Taking longer than expected"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Would you like to retry or complete the transaction now?
          </p>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            
            {transactionId && (
              <Button onClick={handleForceComplete}>
                Complete Transaction Now
              </Button>
            )}
            
            <Button 
              variant="secondary"
              onClick={handleSendNew}
            >
              Start New Transaction
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default LoadingState;
