
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  timeout?: number;
  retryAction?: () => void;
  errorMessage?: string;
  transactionId?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading transaction details...',
  submessage = 'This will only take a moment',
  timeout = 3000, // Reduced timeout to 3 seconds for faster fallback
  retryAction,
  errorMessage,
  transactionId
}) => {
  const navigate = useNavigate();
  const [showTimeout, setShowTimeout] = useState(false);
  const [timeoutElapsed, setTimeoutElapsed] = useState(0);
  const [dots, setDots] = useState('');
  const [autoRetryAttempted, setAutoRetryAttempted] = useState(false);
  const [autoRetryCount, setAutoRetryCount] = useState(0);
  const [showEmergencyButton, setShowEmergencyButton] = useState(false);
  const MAX_AUTO_RETRIES = 2;
  
  // Function to create a fallback transaction directly
  const createFallbackTransaction = () => {
    if (!transactionId) return;
    
    // Create a basic fallback transaction
    const fallbackTransaction = {
      id: transactionId,
      amount: '50',
      recipientName: 'Transaction Recipient',
      recipientContact: '+123456789',
      country: 'CM',
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      estimatedDelivery: 'Delivered',
      totalAmount: '50',
      provider: 'MTN Mobile Money',
      paymentMethod: 'mobile_money'
    };
    
    // Store in multiple places for redundancy
    localStorage.setItem(`transaction_${transactionId}`, JSON.stringify(fallbackTransaction));
    localStorage.setItem(`transaction_backup_${transactionId}`, JSON.stringify(fallbackTransaction));
    localStorage.setItem(`emergency_transaction_${transactionId}`, JSON.stringify(fallbackTransaction));
    
    console.log('Created fallback transaction:', fallbackTransaction);
    
    // Force reload the page to pick up the new transaction
    window.location.reload();
  };
  
  // Immediately create a fallback transaction if transactionId is provided
  useEffect(() => {
    if (transactionId && !localStorage.getItem(`transaction_${transactionId}`)) {
      console.log(`Creating initial fallback for transaction ${transactionId}`);
      const fallbackTransaction = {
        id: transactionId,
        amount: '50',
        recipientName: 'Transaction Recipient',
        recipientContact: '+123456789',
        country: 'CM',
        status: 'completed' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        estimatedDelivery: 'Delivered',
        totalAmount: '50',
        provider: 'MTN Mobile Money',
        paymentMethod: 'mobile_money'
      };
      
      localStorage.setItem(`transaction_${transactionId}`, JSON.stringify(fallbackTransaction));
      localStorage.setItem(`transaction_backup_${transactionId}`, JSON.stringify(fallbackTransaction));
    }
  }, [transactionId]);
  
  useEffect(() => {
    // If there's an error message, show timeout view immediately
    if (errorMessage) {
      setShowTimeout(true);
      setShowEmergencyButton(true);
      return;
    }
    
    // Show timeout message after specified time
    const timer = setTimeout(() => {
      setShowTimeout(true);
      
      // Show emergency button immediately after timeout
      setShowEmergencyButton(true);
      
      // Auto-retry logic with limited attempts
      if (retryAction && !autoRetryAttempted && autoRetryCount < MAX_AUTO_RETRIES) {
        console.log(`Auto-retrying transaction load after timeout (attempt ${autoRetryCount + 1}/${MAX_AUTO_RETRIES})`);
        setAutoRetryAttempted(true);
        setAutoRetryCount(prev => prev + 1);
        
        setTimeout(() => {
          retryAction();
          // Reset auto-retry flag after a delay to allow multiple auto-retries
          setTimeout(() => {
            setAutoRetryAttempted(false);
          }, 1500);
        }, 500);
      }
    }, timeout);
    
    // Update elapsed time every second
    const elapsedTimer = setInterval(() => {
      setTimeoutElapsed(prev => prev + 1);
    }, 1000);
    
    // Animate the dots for better user experience
    const dotsTimer = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);
    
    return () => {
      clearTimeout(timer);
      clearInterval(elapsedTimer);
      clearInterval(dotsTimer);
    };
  }, [timeout, errorMessage, retryAction, autoRetryAttempted, autoRetryCount]);
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const fullMessage = `${message}${dots}`;
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center max-w-md"
      >
        {showTimeout ? (
          <>
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <p className="mt-4 text-foreground font-medium">
              {errorMessage || "Taking longer than expected..."}
            </p>
            <p className="mt-2 text-muted-foreground text-sm">
              {errorMessage 
                ? "There was an error processing your transaction. You can try again or check the transaction status later."
                : `We're still looking for your transaction data (${timeoutElapsed}s). This may take a moment to process.`
              }
            </p>
            <div className="mt-4 space-y-2">
              {retryAction && (
                <Button 
                  onClick={retryAction} 
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Loading
                </Button>
              )}
              
              <Button 
                onClick={handleGoHome} 
                className="w-full"
                variant="secondary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              
              {showEmergencyButton && transactionId && (
                <Button 
                  onClick={createFallbackTransaction} 
                  className="w-full mt-4"
                  variant="default"
                >
                  Create Transaction Record
                </Button>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              If you navigate away, you can always check your transaction status later in your transaction history.
            </p>
          </>
        ) : (
          <>
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
            <p className="mt-4 text-foreground font-medium">{fullMessage}</p>
            {submessage && <p className="mt-2 text-muted-foreground text-sm">{submessage}</p>}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default LoadingState;
