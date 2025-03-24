
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionNotFoundProps {
  errorType?: string;
  errorMessage?: string;
}

const TransactionNotFound: React.FC<TransactionNotFoundProps> = ({ 
  errorType = 'not_found',
  errorMessage
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get error information from location state if available
  const locationState = location.state as { errorType?: string; message?: string } | null;
  const finalErrorType = locationState?.errorType || errorType;
  const finalErrorMessage = locationState?.message || errorMessage;
  
  const handleGoToHome = () => {
    navigate('/dashboard');
  };
  
  const handleTryAgain = () => {
    toast.info("Retrying transaction", {
      description: "Returning to the send money page..."
    });
    navigate('/send');
  };
  
  // Different messages based on error type
  const getErrorTitle = () => {
    switch (finalErrorType) {
      case 'kado_connection_error':
        return 'Connection Error';
      case 'api_error':
        return 'API Error';
      case 'payment_failed':
        return 'Payment Failed';
      default:
        return 'Transaction Not Found';
    }
  };
  
  const getErrorDescription = () => {
    if (finalErrorMessage) {
      return finalErrorMessage;
    }
    
    switch (finalErrorType) {
      case 'kado_connection_error':
        return 'We couldn\'t connect to our payment provider. This could be due to network issues or temporary maintenance.';
      case 'api_error':
        return 'There was a problem communicating with our payment API. Our team has been notified about this issue.';
      case 'payment_failed':
        return 'Your payment couldn\'t be processed. No funds have been deducted from your account.';
      default:
        return 'We couldn\'t find the transaction you\'re looking for. It may have expired, been removed, or there might be an issue with our system.';
    }
  };
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-50 text-red-600 rounded-full p-3 mb-4">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{getErrorTitle()}</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        {getErrorDescription()}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleTryAgain} 
          className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Try Again
        </Button>
        <Button 
          onClick={handleGoToHome} 
          variant="outline"
          className="border-primary-600 text-primary-600 flex items-center gap-2"
        >
          <Home size={18} />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default TransactionNotFound;
