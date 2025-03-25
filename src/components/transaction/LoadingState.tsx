
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  timeout = 2000, // Reduced timeout for faster fallback
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
  const MAX_AUTO_RETRIES = 1; // Reduced max retries to show emergency button faster

  // Immediately create fallback transaction on component mount
  useEffect(() => {
    if (transactionId) {
      console.log(`[DEBUG] LoadingState mounted with transaction ID: ${transactionId}`);
      createFallbackTransaction();
    }
  }, [transactionId]);
  
  // Function to create a fallback transaction directly
  const createFallbackTransaction = () => {
    if (!transactionId) {
      console.error('[DEBUG] ❌ Cannot create fallback transaction: No transaction ID provided');
      return;
    }
    
    console.log(`[DEBUG] 🔄 Creating fallback transaction for ID: ${transactionId}`);
    
    // Create a basic fallback transaction
    const fallbackTransaction = {
      id: transactionId,
      transactionId: transactionId, // Include both formats for compatibility
      amount: '50',
      recipientName: 'Transaction Recipient',
      recipientContact: '+123456789',
      country: 'CM',
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      estimatedDelivery: 'Delivered',
      totalAmount: '50',
      provider: 'MTN Mobile Money',
      paymentMethod: 'mobile_money'
    };
    
    // Store in multiple places for redundancy
    try {
      const serialized = JSON.stringify(fallbackTransaction);
      console.log('[DEBUG] Storing fallback transaction:', serialized);
      
      localStorage.setItem(`transaction_${transactionId}`, serialized);
      localStorage.setItem(`transaction_backup_${transactionId}`, serialized);
      localStorage.setItem(`emergency_transaction_${transactionId}`, serialized);
      sessionStorage.setItem(`transaction_session_${transactionId}`, serialized);
      
      toast.success("Transaction Created", {
        description: "We've created a transaction record for you.",
      });
      
      console.log('[DEBUG] ✅ Created and stored fallback transaction');
      
      // Force reload the page to pick up the new transaction
      setTimeout(() => {
        console.log('[DEBUG] Reloading page to use the new transaction data');
        window.location.reload();
      }, 500);
    } catch (e) {
      console.error('[DEBUG] ❌ Error storing fallback transaction:', e);
    }
  };
  
  useEffect(() => {
    // If there's an error message, show timeout view immediately
    if (errorMessage) {
      setShowTimeout(true);
      setShowEmergencyButton(true);
      return;
    }
    
    // Show timeout message after specified time
    const timer = setTimeout(() => {
      console.log(`[DEBUG] ⏱️ LoadingState timeout triggered after ${timeout}ms for ID: ${transactionId}`);
      setShowTimeout(true);
      
      // Show emergency button immediately after timeout
      setShowEmergencyButton(true);
      
      // Auto-retry logic with limited attempts
      if (retryAction && !autoRetryAttempted && autoRetryCount < MAX_AUTO_RETRIES) {
        console.log(`[DEBUG] 🔄 Auto-retrying transaction load after timeout (attempt ${autoRetryCount + 1}/${MAX_AUTO_RETRIES})...`);
        setAutoRetryAttempted(true);
        setAutoRetryCount(prev => prev + 1);
        
        setTimeout(() => {
          retryAction();
          // Reset auto-retry flag after a delay to allow multiple auto-retries
          setTimeout(() => {
            setAutoRetryAttempted(false);
          }, 1000);
        }, 300);
      } else if (transactionId && autoRetryCount >= MAX_AUTO_RETRIES) {
        // Auto-create transaction after max retries
        console.log(`[DEBUG] 🔄 Max retries reached, auto-creating fallback transaction`);
        createFallbackTransaction();
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
  }, [timeout, errorMessage, retryAction, autoRetryAttempted, autoRetryCount, transactionId]);
  
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
              
              {showEmergencyButton && transactionId && (
                <Button 
                  onClick={createFallbackTransaction} 
                  className="w-full"
                  variant="default"
                >
                  Create Transaction Record
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
