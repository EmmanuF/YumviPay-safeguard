
import React from 'react';
import { Search, Download, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onExport: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onExport,
  onRefresh,
  isRefreshing
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary-800">Transaction Management</h1>
        <p className="text-muted-foreground">Monitor and manage all transactions across the platform</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={onExport} className="border-blue-200 hover:bg-blue-50">
          <Download className="mr-2 h-4 w-4 text-blue-600" />
          Export
        </Button>
        
        <Button 
          onClick={onRefresh} 
          variant="outline"
          className="border-blue-200 hover:bg-blue-50"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 text-blue-600 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};

export default TransactionHeader;
