
import React from 'react';

interface PaymentLoadingStateProps {
  message?: string;
}

const PaymentLoadingState: React.FC<PaymentLoadingStateProps> = ({ 
  message = 'Loading payment options...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="h-12 w-12 text-primary animate-spin">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default PaymentLoadingState;
