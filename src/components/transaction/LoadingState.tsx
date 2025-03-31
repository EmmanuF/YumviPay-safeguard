
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw, WifiOff, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createFallbackTransaction } from '@/services/transaction';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';
import { useNetwork } from '@/contexts/NetworkContext';
import { useLocale } from '@/contexts/LocaleContext';
import { isPlatform } from '@/utils/platformUtils';
import { ImpactStyle, NotificationType } from '@capacitor/haptics';

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
  const { getOptimizedAnimationSettings } = useDeviceOptimizations(); 
  const { isOffline } = useNetwork();
  const { t } = useLocale();
  const isNative = isPlatform('capacitor');
  
  // Animation settings based on device
  const animationSettings = getOptimizedAnimationSettings();
  
  // Combine both retry handlers for backward compatibility
  const handleRetry = () => {
    if (isOffline) {
      toast.error(
        t('error.offline') || 'You are currently offline', 
        { description: t('error.check.connection') || 'Please check your connection' }
      );
      return;
    }
    
    if (onRetry) {
      onRetry();
    } else if (retryAction) {
      retryAction();
    } else {
      window.location.reload();
    }
    
    // Trigger haptic feedback on native devices
    if (isNative) {
      triggerHapticFeedback();
    }
  };
  
  // Trigger haptic feedback on native devices
  const triggerHapticFeedback = async () => {
    if (isNative) {
      try {
        const { Haptics } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Medium });
      } catch (e) {
        console.error('Error triggering haptic feedback:', e);
      }
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
        if (isNative) {
          triggerHapticFeedback();
        }
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [timeout]);
  
  // Emergency function to force complete a transaction
  const handleForceComplete = async () => {
    if (!transactionId) {
      toast.error(t('error.no.transaction') || "No transaction ID available");
      return;
    }
    
    try {
      // Trigger haptic feedback on native
      if (isNative) {
        try {
          const { Haptics } = await import('@capacitor/haptics');
          await Haptics.notification({ type: NotificationType.Warning });
        } catch (e) {
          console.error('Error with haptics:', e);
        }
      }
      
      // Create a completed fallback transaction
      const fallback = createFallbackTransaction(transactionId);
      
      toast.success(
        t('transaction.created') || "Transaction Created", 
        { description: t('transaction.marked.completed') || "Your transaction has been marked as completed" }
      );
      
      // Reload the current page to refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error forcing transaction completion:', error);
      toast.error(t('error.updating.transaction') || "Error Updating Transaction");
    }
  };
  
  // Go to send money page
  const handleSendNew = () => {
    // Trigger haptic feedback on native
    if (isNative) {
      triggerHapticFeedback();
    }
    
    navigate('/transaction/new');
  };
  
  // If we're offline, show special offline state
  if (isOffline) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: animationSettings.duration }}
        className="flex flex-col items-center justify-center p-8 min-h-[200px]"
      >
        <WifiOff className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('error.offline') || 'You are currently offline'}</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          {t('error.offline.transaction') || 'Cannot load transaction details while offline'}
        </p>
        
        {transactionId && hasData && (
          <Button onClick={handleForceComplete} className="mb-2">
            {t('transaction.view.offline') || 'View Offline Data'}
          </Button>
        )}
        
        <Button variant="outline" onClick={handleRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('action.retry') || 'Retry'}
        </Button>
      </motion.div>
    );
  }
  
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: animationSettings.duration }}
        className="flex flex-col items-center justify-center p-8 min-h-[200px]"
      >
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('error.loading.data') || 'Error Loading Data'}</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          {error instanceof Error ? error.message : error.toString()}
        </p>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('action.retry') || 'Retry'}
          </Button>
          <Button onClick={handleSendNew}>
            {t('transaction.new') || 'Start New Transaction'}
          </Button>
        </div>
      </motion.div>
    );
  }
  
  // Show options immediately for TXN- prefixed transactions
  const isTxnFormat = transactionId && transactionId.startsWith('TXN-');
  const showOptions = timeoutReached || isTxnFormat;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: animationSettings.duration }}
      className="flex flex-col items-center justify-center p-8 min-h-[200px]"
    >
      {!showOptions ? (
        <>
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h3 className="text-lg font-semibold mb-2">{message}</h3>
          {submessage && <p className="text-sm text-muted-foreground text-center">{submessage}</p>}
          
          {isNative && (
            <div className="mt-6 flex items-center justify-center text-sm">
              <Smartphone className="h-4 w-4 mr-1.5" />
              <span className="text-muted-foreground">
                {t('app.optimized.mobile') || 'Optimized for mobile'}
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isTxnFormat ? 
              (t('transaction.creating') || "Creating Your Transaction") : 
              (t('transaction.taking.longer') || "Taking longer than expected")}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            {t('transaction.retry.options') || "Would you like to retry or complete the transaction now?"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('action.retry') || 'Retry'}
            </Button>
            
            {transactionId && (
              <Button onClick={handleForceComplete}>
                {t('transaction.complete.now') || 'Complete Transaction Now'}
              </Button>
            )}
            
            <Button 
              variant="secondary"
              onClick={handleSendNew}
            >
              {t('transaction.start.new') || 'Start New Transaction'}
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default LoadingState;
