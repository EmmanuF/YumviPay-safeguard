
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const TransactionNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGoToHome = () => {
    navigate('/dashboard');
  };
  
  const handleTryAgain = () => {
    navigate('/send');
  };
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-50 text-red-600 rounded-full p-3 mb-4">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Transaction Not Found</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        We couldn't find the transaction you're looking for. It may have expired, been removed, or there might be an issue with the redirection to Kado.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleTryAgain} 
          className="bg-primary-600 hover:bg-primary-700"
        >
          Try Again
        </Button>
        <Button 
          onClick={handleGoToHome} 
          variant="outline"
          className="border-primary-600 text-primary-600"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default TransactionNotFound;
