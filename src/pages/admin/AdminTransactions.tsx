
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye,
  Receipt
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatDate } from '@/utils/formatUtils';
import { useToast } from '@/components/ui/use-toast';
import { 
  getAdminTransactions, 
  adminUpdateTransactionStatus 
} from '@/services/admin/adminTransactionService';
import { AdminReceiptGenerator } from '@/components/admin/transactions';

const AdminTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const { toast } = useToast();
  
  const { 
    data: transactions = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['adminTransactions'],
    queryFn: getAdminTransactions,
  });
  
  // Filter transactions based on search term and status
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const success = await adminUpdateTransactionStatus(id, newStatus);
      
      if (success) {
        toast({
          title: "Status Updated",
          description: `Transaction status has been changed to ${newStatus}`,
        });
        
        refetch();
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update transaction status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the transaction status",
        variant: "destructive",
      });
    }
  };
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your export will be ready for download shortly.",
    });
    
    // In a real implementation, this would trigger a CSV/Excel export
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Transaction Management</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              View and manage all transactions across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found matching your search criteria
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id.slice(0, 8)}...</TableCell>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell>{transaction.amount} {transaction.currency}</TableCell>
                      <TableCell>{transaction.recipient}</TableCell>
                      <TableCell>{transaction.country}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedTransaction(transaction.rawTransaction)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                              <DialogDescription>
                                Complete information about this transaction
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTransaction && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-sm text-muted-foreground">ID</div>
                                  <div className="text-sm font-medium">{selectedTransaction.id}</div>
                                  
                                  <div className="text-sm text-muted-foreground">Amount</div>
                                  <div className="text-sm font-medium">{selectedTransaction.amount} {selectedTransaction.currency || 'USD'}</div>
                                  
                                  <div className="text-sm text-muted-foreground">Status</div>
                                  <div className="text-sm font-medium">{getStatusBadge(selectedTransaction.status)}</div>
                                  
                                  <div className="text-sm text-muted-foreground">Recipient</div>
                                  <div className="text-sm font-medium">{selectedTransaction.recipientName}</div>
                                  
                                  <div className="text-sm text-muted-foreground">Contact</div>
                                  <div className="text-sm font-medium">{selectedTransaction.recipientContact || 'N/A'}</div>
                                  
                                  <div className="text-sm text-muted-foreground">Country</div>
                                  <div className="text-sm font-medium">{selectedTransaction.country}</div>
                                  
                                  <div className="text-sm text-muted-foreground">Created</div>
                                  <div className="text-sm font-medium">{formatDate(selectedTransaction.createdAt)}</div>
                                  
                                  {selectedTransaction.completedAt && (
                                    <>
                                      <div className="text-sm text-muted-foreground">Completed</div>
                                      <div className="text-sm font-medium">{formatDate(selectedTransaction.completedAt)}</div>
                                    </>
                                  )}
                                  
                                  {selectedTransaction.failureReason && (
                                    <>
                                      <div className="text-sm text-muted-foreground">Failure Reason</div>
                                      <div className="text-sm font-medium text-red-500">{selectedTransaction.failureReason}</div>
                                    </>
                                  )}
                                </div>
                                
                                <div className="flex justify-between pt-4">
                                  {selectedTransaction && (
                                    <AdminReceiptGenerator transaction={selectedTransaction} />
                                  )}
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button>Update Status</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                                      <DropdownMenuItem onClick={() => {
                                        handleStatusChange(selectedTransaction.id, 'completed');
                                        setSelectedTransaction(null);
                                      }}>
                                        Mark as Completed
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        handleStatusChange(selectedTransaction.id, 'processing');
                                        setSelectedTransaction(null);
                                      }}>
                                        Mark as Processing
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        handleStatusChange(selectedTransaction.id, 'failed');
                                        setSelectedTransaction(null);
                                      }}>
                                        Mark as Failed
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
