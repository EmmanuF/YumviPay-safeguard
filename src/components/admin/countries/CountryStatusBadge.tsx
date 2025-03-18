
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CountryStatusBadgeProps {
  enabled: boolean;
  type: 'sending' | 'receiving';
}

const CountryStatusBadge: React.FC<CountryStatusBadgeProps> = ({
  enabled,
  type
}) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        enabled 
          ? "bg-green-50 text-green-700 border-green-200" 
          : "bg-gray-50 text-gray-500 border-gray-200"
      )}
    >
      {enabled ? `${type === 'sending' ? 'Sending' : 'Receiving'} enabled` : `${type === 'sending' ? 'Sending' : 'Receiving'} disabled`}
    </Badge>
  );
};

export default CountryStatusBadge;
