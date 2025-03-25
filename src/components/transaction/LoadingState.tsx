
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  timeout?: number; // Time in ms after which to show timeout message
  retryAction?: () => void; // Optional retry action
  errorMessage?: string; // Optional error message to display
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading transaction details...',
  submessage = 'This will only take a moment',
  timeout = 4000, // Reduced to 4 seconds for better UX
  retryAction,
  errorMessage
}) => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [timeoutElapsed, setTimeoutElapsed] = useState(0);
  const [dots, setDots] = useState('');
  const [autoRetryAttempted, setAutoRetryAttempted] = useState(false);
  
  useEffect(() => {
    // If there's an error message, show timeout view immediately
    if (errorMessage) {
      setShowTimeout(true);
      return;
    }
    
    // Show timeout message after specified time
    const timer = setTimeout(() => {
      setShowTimeout(true);
      
      // Auto-retry once if retry action exists and hasn't been attempted yet
      if (retryAction && !autoRetryAttempted) {
        console.log('Auto-retrying transaction load after timeout');
        setAutoRetryAttempted(true);
        setTimeout(() => {
          retryAction();
        }, 1000);
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
  }, [timeout, errorMessage, retryAction, autoRetryAttempted]);
  
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
            {retryAction && (
              <Button 
                onClick={retryAction} 
                className="mt-4"
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Loading
              </Button>
            )}
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
