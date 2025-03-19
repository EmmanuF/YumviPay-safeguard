
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Eye,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  ArrowDownUp
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDate } from '@/utils/formatUtils';

interface TransactionListProps {
  transactions: any[];
  filteredTransactions: any[];
  isLoading: boolean;
  error: any;
  sortField: string;
  sortDirection: string;
  toggleSort: (field: string) => void;
  onViewTransaction: (transaction: any) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions,
  filteredTransactions,
  isLoading,
  error,
  sortField,
  sortDirection,
  toggleSort,
  onViewTransaction
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" /> Completed
        </Badge>;
      case 'processing':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Processing
        </Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-400 bg-yellow-50 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Pending
        </Badge>;
      case 'failed':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Failed
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load transaction data. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (filteredTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions found matching your search criteria
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead className="cursor-pointer" onClick={() => toggleSort('amount')}>
              <div className="flex items-center">
                Amount
                {sortField === 'amount' && (
                  <ArrowDownUp className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="cursor-pointer" onClick={() => toggleSort('date')}>
              <div className="flex items-center">
                Date
                {sortField === 'date' && (
                  <ArrowDownUp className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium">{transaction.id.slice(0, 8)}...</TableCell>
              <TableCell>{transaction.user}</TableCell>
              <TableCell>
                {transaction.currency} {transaction.amount}
              </TableCell>
              <TableCell>{transaction.recipient}</TableCell>
              <TableCell>{transaction.country}</TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewTransaction(transaction.rawTransaction)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
