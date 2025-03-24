
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  timeout?: number; // Time in ms after which to show timeout message
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading transaction details...',
  submessage = 'Please wait while we process your request',
  timeout = 10000 // 10 seconds default
}) => {
  const [showTimeout, setShowTimeout] = useState(false);
  
  useEffect(() => {
    // Show timeout message after specified time
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [timeout]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center max-w-md"
      >
        {showTimeout ? (
          <>
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <p className="mt-4 text-foreground font-medium">Taking longer than expected...</p>
            <p className="mt-2 text-muted-foreground text-sm">
              This is taking longer than usual. You can wait or try refreshing the page.
            </p>
          </>
        ) : (
          <>
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
            <p className="mt-4 text-foreground font-medium">{message}</p>
            {submessage && <p className="mt-2 text-muted-foreground text-sm">{submessage}</p>}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default LoadingState;
