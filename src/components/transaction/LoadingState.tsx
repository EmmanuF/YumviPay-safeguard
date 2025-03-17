
import React from 'react';
import { Clock } from 'lucide-react';
import Header from '@/components/Header';
import HeaderRight from '@/components/HeaderRight';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading transaction details...',
  submessage
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center">
        <Clock className="h-10 w-10 text-primary mx-auto animate-pulse" />
        <p className="mt-4 text-foreground">{message}</p>
        {submessage && <p className="mt-2 text-muted-foreground text-sm">{submessage}</p>}
      </div>
    </div>
  );
};

export default LoadingState;
