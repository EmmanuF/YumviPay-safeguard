
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface RecoveryStateProps {
  message?: string;
}

const RecoveryState: React.FC<RecoveryStateProps> = ({ 
  message = "Transaction data recovered, loading..." 
}) => {
  return (
    <div className="p-4 text-center">
      <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default RecoveryState;
