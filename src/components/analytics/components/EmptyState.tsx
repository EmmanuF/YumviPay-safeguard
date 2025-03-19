
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ className = '' }) => {
  return (
    <Card 
      className={`${className} h-[300px] flex items-center justify-center`}
      gradient="blue"
    >
      <CardContent>
        <p className="text-center text-muted-foreground">
          No transaction data available yet. Start sending money to see your analytics.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
