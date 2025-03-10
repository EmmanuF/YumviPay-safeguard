
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TransactionStatus } from '@/types/transaction';

interface StatusFilterProps {
  statusFilter: TransactionStatus | 'all';
  setStatusFilter: (status: TransactionStatus | 'all') => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ 
  statusFilter, 
  setStatusFilter 
}) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Status</h4>
      <RadioGroup value={statusFilter} onValueChange={(value) => setStatusFilter(value as TransactionStatus | 'all')}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="status-all" />
          <Label htmlFor="status-all">All</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="completed" id="status-completed" />
          <Label htmlFor="status-completed">Completed</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pending" id="status-pending" />
          <Label htmlFor="status-pending">Pending</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="failed" id="status-failed" />
          <Label htmlFor="status-failed">Failed</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default StatusFilter;
