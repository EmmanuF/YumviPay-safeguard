
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface StatusFilterProps {
  statusFilter: string[];
  toggleStatusFilter: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ 
  statusFilter, 
  toggleStatusFilter 
}) => {
  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' }
  ];
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Status</h4>
      <div className="space-y-2">
        {statuses.map((status) => (
          <div key={status.value} className="flex items-center space-x-2">
            <Checkbox 
              id={`status-${status.value}`} 
              checked={statusFilter.includes(status.value)}
              onCheckedChange={() => toggleStatusFilter(status.value)}
            />
            <Label htmlFor={`status-${status.value}`}>{status.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;
