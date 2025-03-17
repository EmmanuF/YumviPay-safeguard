
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingCalculatorProps {
  className?: string;
}

const LoadingCalculator: React.FC<LoadingCalculatorProps> = ({ className }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-xl overflow-hidden ${className}`}>
      <Skeleton className="h-16 w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-24" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-24" />
          </div>
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
};

export default LoadingCalculator;
