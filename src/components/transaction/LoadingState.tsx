
import React from 'react';
import { Clock } from 'lucide-react';
import Header from '@/components/Header';
import HeaderRight from '@/components/HeaderRight';

const LoadingState: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center">
        <Clock className="h-10 w-10 text-primary-500 mx-auto animate-pulse" />
        <p className="mt-4 text-foreground">Loading transaction details...</p>
      </div>
    </div>
  );
};

export default LoadingState;
