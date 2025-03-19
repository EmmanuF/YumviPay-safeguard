
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/utils/formatUtils';
import { Transaction } from '@/types/transaction';
import { AdminReceiptGenerator } from '@/components/admin/transactions';

interface TransactionDetailsProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
  isOpen,
  onOpenChange,
  onStatusChange
}) => {
  if (!transaction) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Complete information about this transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-muted-foreground">ID</div>
            <div className="text-sm font-medium">{transaction.id}</div>
            
            <div className="text-sm text-muted-foreground">Amount</div>
            <div className="text-sm font-medium">{transaction.amount} {transaction.currency || 'USD'}</div>
            
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="text-sm font-medium">{getStatusBadge(transaction.status)}</div>
            
            <div className="text-sm text-muted-foreground">Recipient</div>
            <div className="text-sm font-medium">{transaction.recipientName}</div>
            
            <div className="text-sm text-muted-foreground">Contact</div>
            <div className="text-sm font-medium">{transaction.recipientContact || 'N/A'}</div>
            
            <div className="text-sm text-muted-foreground">Country</div>
            <div className="text-sm font-medium">{transaction.country}</div>
            
            <div className="text-sm text-muted-foreground">Created</div>
            <div className="text-sm font-medium">{formatDate(transaction.createdAt)}</div>
            
            {transaction.completedAt && (
              <>
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-sm font-medium">{formatDate(transaction.completedAt)}</div>
              </>
            )}
            
            {transaction.failureReason && (
              <>
                <div className="text-sm text-muted-foreground">Failure Reason</div>
                <div className="text-sm font-medium text-red-500">{transaction.failureReason}</div>
              </>
            )}
            
            {transaction.paymentMethod && (
              <>
                <div className="text-sm text-muted-foreground">Payment Method</div>
                <div className="text-sm font-medium">{transaction.paymentMethod}</div>
              </>
            )}
            
            {transaction.provider && (
              <>
                <div className="text-sm text-muted-foreground">Provider</div>
                <div className="text-sm font-medium">{transaction.provider}</div>
              </>
            )}
          </div>
          
          <div className="flex justify-between pt-4">
            {transaction && (
              <AdminReceiptGenerator transaction={transaction} />
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Update Status</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onStatusChange(transaction.id, 'completed')}>
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(transaction.id, 'processing')}>
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  Mark as Processing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(transaction.id, 'pending')}>
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                  Mark as Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(transaction.id, 'failed')}>
                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                  Mark as Failed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetails;
