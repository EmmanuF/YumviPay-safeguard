
import React from 'react';
import { Loader2, AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext';
import { isPlatform } from '@/utils/platformUtils';
import { Button } from '@/components/ui/button';

interface PaymentLoadingStateProps {
  message?: string;
  error?: string;
  onRetry?: () => void;
  isOffline?: boolean;
  loadingType?: 'default' | 'processing' | 'verifying';
}

const PaymentLoadingState: React.FC<PaymentLoadingStateProps> = ({ 
  message = 'Loading payment options...',
  error,
  onRetry,
  isOffline = false,
  loadingType = 'default'
}) => {
  const { t } = useLocale();
  const isNative = isPlatform('capacitor');
  
  // Different loading messages based on loading type
  const loadingMessages = {
    default: t('payment.loading.default') || message,
    processing: t('payment.loading.processing') || 'Processing your payment...',
    verifying: t('payment.loading.verifying') || 'Verifying your transaction...'
  };
  
  const displayMessage = loadingMessages[loadingType];
  
  // Customize animation based on platform
  const animationDuration = isNative ? 0.2 : 0.3; // Faster animations on mobile
  
  if (isOffline) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: animationDuration }}
        className="flex flex-col items-center justify-center py-12 space-y-4"
      >
        <div className="h-12 w-12 text-yellow-500 flex items-center justify-center">
          <WifiOff size={36} />
        </div>
        <p className="text-gray-700 font-medium text-center px-4">
          {t('common.offline') || 'You are currently offline'}
        </p>
        <p className="text-gray-600 text-sm text-center px-6">
          {t('common.offline.description') || 'Please check your connection and try again'}
        </p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="mt-4"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.retry') || 'Retry'}
          </Button>
        )}
      </motion.div>
    );
  }
  
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: animationDuration }}
        className="flex flex-col items-center justify-center py-12 space-y-4"
      >
        <div className="h-12 w-12 text-red-500 flex items-center justify-center">
          <AlertTriangle size={36} />
        </div>
        <p className="text-red-600 font-medium text-center px-4">{error}</p>
        <p className="text-gray-600 text-sm text-center px-6">
          {t('payment.error.help') || 'Please try again or contact support if the issue persists'}
        </p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="mt-4"
            variant="default"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.retry') || 'Retry'}
          </Button>
        )}
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: animationDuration }}
      className="flex flex-col items-center justify-center py-12 space-y-4"
    >
      <div className="h-12 w-12 text-primary flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
      <p className="text-gray-700 font-medium">{displayMessage}</p>
      
      {loadingType === 'processing' && (
        <div className="w-full max-w-xs mt-4">
          <div className="relative h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-primary rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '80%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {t('payment.loading.time') || 'This may take a few moments'}
          </p>
        </div>
      )}
      
      {loadingType !== 'processing' && (
        <div className="flex space-x-1.5 mt-2">
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentLoadingState;
