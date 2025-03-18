import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNetwork } from '@/contexts/network';

interface StatusFilterProps {
  statusFilter: string[];
  toggleStatusFilter: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ 
  statusFilter, 
  toggleStatusFilter 
}) => {
  const { isOffline } = useNetwork();
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Status</h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="status-pending" 
            checked={statusFilter.includes('pending')}
            onCheckedChange={() => toggleStatusFilter('pending')}
          />
          <Label htmlFor="status-pending">Pending</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="status-processing" 
            checked={statusFilter.includes('processing')}
            onCheckedChange={() => toggleStatusFilter('processing')}
          />
          <Label htmlFor="status-processing">Processing</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="status-completed" 
            checked={statusFilter.includes('completed')}
            onCheckedChange={() => toggleStatusFilter('completed')}
          />
          <Label htmlFor="status-completed">Completed</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="status-failed" 
            checked={statusFilter.includes('failed')}
            onCheckedChange={() => toggleStatusFilter('failed')}
          />
          <Label htmlFor="status-failed">Failed</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="status-cancelled" 
            checked={statusFilter.includes('cancelled')}
            onCheckedChange={() => toggleStatusFilter('cancelled')}
          />
          <Label htmlFor="status-cancelled">Cancelled</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="status-offline-pending" 
            checked={statusFilter.includes('offline-pending')}
            onCheckedChange={() => toggleStatusFilter('offline-pending')}
          />
          <Label htmlFor="status-offline-pending" className="flex items-center">
            Offline Pending
            {isOffline && (
              <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 text-xs">
                Available Offline
              </Badge>
            )}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;
