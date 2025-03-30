
import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext';

interface PaymentLoadingStateProps {
  message?: string;
  error?: string;
  onRetry?: () => void;
}

const PaymentLoadingState: React.FC<PaymentLoadingStateProps> = ({ 
  message = 'Loading payment options...',
  error,
  onRetry
}) => {
  const { t } = useLocale();
  
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 space-y-4"
      >
        <div className="h-12 w-12 text-red-500 flex items-center justify-center">
          <AlertTriangle size={36} />
        </div>
        <p className="text-red-600 font-medium">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            {t('common.retry')}
          </button>
        )}
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 space-y-4"
    >
      <div className="h-12 w-12 text-primary flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
      <p className="text-gray-600">{message}</p>
      <div className="flex space-x-1 mt-2">
        <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
      </div>
    </motion.div>
  );
};

export default PaymentLoadingState;
