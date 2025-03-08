
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TransactionNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGoToHome = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-foreground">Transaction not found.</p>
        <Button onClick={handleGoToHome} className="mt-4">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default TransactionNotFound;
