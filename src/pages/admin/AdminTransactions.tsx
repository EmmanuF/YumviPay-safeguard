
import React, { useState, useCallback } from 'react';
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
  CardTitle,
  CardFooter
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
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
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowDownUp,
  Receipt,
  RefreshCw
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatDate, formatCurrency } from '@/utils/formatUtils';
import { useToast } from '@/components/ui/use-toast';
import { 
  getAdminTransactions, 
  adminUpdateTransactionStatus,
  getTransactionStatistics 
} from '@/services/admin/adminTransactionService';
import { AdminReceiptGenerator } from '@/components/admin/transactions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Fetch transactions
  const { 
    data: transactions = [], 
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
    error: transactionsError
  } = useQuery({
    queryKey: ['adminTransactions'],
    queryFn: getAdminTransactions,
  });
  
  // Fetch transaction statistics
  const {
    data: statistics,
    isLoading: statsLoading,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['transactionStatistics'],
    queryFn: getTransactionStatistics,
  });
  
  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchTransactions(),
        refetchStats()
      ]);
      toast({
        title: "Data Refreshed",
        description: "Transaction data has been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not update transaction data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchTransactions, refetchStats, toast]);
  
  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === 'amount') {
        const amountA = parseFloat(a.amount);
        const amountB = parseFloat(b.amount);
        return sortDirection === 'asc' ? amountA - amountB : amountB - amountA;
      }
      return 0;
    });
  
  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Handle transaction status updates
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const success = await adminUpdateTransactionStatus(id, newStatus);
      
      if (success) {
        toast({
          title: "Status Updated",
          description: `Transaction status has been changed to ${newStatus}`,
          className: "bg-green-50 border-l-4 border-green-500",
        });
        
        await Promise.all([refetchTransactions(), refetchStats()]);
        setIsDetailsOpen(false);
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
  
  // Handle export functionality
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your export will be ready for download shortly.",
    });
    
    // In a real implementation, this would trigger a CSV/Excel export
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your transaction export is ready to download.",
        className: "bg-green-50 border-l-4 border-green-500",
      });
    }, 1500);
  };
  
  // Generate status badge
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
    <AdminLayout>
      <div className="flex flex-col space-y-6">
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
            
            <Button variant="outline" onClick={handleExport} className="border-blue-200 hover:bg-blue-50">
              <Download className="mr-2 h-4 w-4 text-blue-600" />
              Export
            </Button>
            
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              className="border-blue-200 hover:bg-blue-50"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 text-blue-600 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
        
        {/* Transaction statistics cards */}
        {!statsLoading && statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                    <h4 className="text-2xl font-bold text-primary-800 mt-1">{statistics.totalCount}</h4>
                  </div>
                  <div className="bg-primary-50 p-2 rounded-full">
                    <ArrowDownUp className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <p className="truncate">All time transactions</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                    <h4 className="text-2xl font-bold text-primary-800 mt-1">{statistics.totalVolume}</h4>
                  </div>
                  <div className="bg-green-50 p-2 rounded-full">
                    <Receipt className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <p className="truncate">Total amount processed</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <h4 className="text-2xl font-bold text-green-600 mt-1">{statistics.byStatus?.completed || 0}</h4>
                  </div>
                  <div className="bg-green-50 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <p className="truncate">Successfully completed transactions</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending/Processing</p>
                    <h4 className="text-2xl font-bold text-yellow-600 mt-1">
                      {(statistics.byStatus?.pending || 0) + (statistics.byStatus?.processing || 0)}
                    </h4>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <p className="truncate">Transactions in progress</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Transaction List</TabsTrigger>
            <TabsTrigger value="stats">Transaction Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card>
              <CardHeader className="bg-gradient-to-br from-primary-50 to-white border-b">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  View and manage transactions across the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {transactionsError && (
                  <Alert variant="destructive" className="m-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to load transaction data. Please try refreshing the page.
                    </AlertDescription>
                  </Alert>
                )}
                
                {transactionsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found matching your search criteria
                  </div>
                ) : (
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
                                onClick={() => {
                                  setSelectedTransaction(transaction.rawTransaction);
                                  setIsDetailsOpen(true);
                                }}
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
                )}
              </CardContent>
              <CardFooter className="bg-gray-50 border-t px-4 py-3 text-sm text-gray-500">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Analytics</CardTitle>
                <CardDescription>
                  Visualize transaction data and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !statistics ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No analytics data available
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Status Distribution */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {statistics.byStatus && Object.entries(statistics.byStatus).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                {getStatusBadge(status)}
                              </div>
                              <span className="text-sm font-medium">{count}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                      
                      {/* Country Distribution */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Country Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {statistics.byCountry && Object.entries(statistics.byCountry)
                            .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
                            .slice(0, 5)
                            .map(([country, count]) => (
                              <div key={country} className="flex items-center justify-between mb-2">
                                <span className="text-sm">{country}</span>
                                <span className="text-sm font-medium">{count}</span>
                              </div>
                            ))}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Transaction Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
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
                  
                  {selectedTransaction.paymentMethod && (
                    <>
                      <div className="text-sm text-muted-foreground">Payment Method</div>
                      <div className="text-sm font-medium">{selectedTransaction.paymentMethod}</div>
                    </>
                  )}
                  
                  {selectedTransaction.provider && (
                    <>
                      <div className="text-sm text-muted-foreground">Provider</div>
                      <div className="text-sm font-medium">{selectedTransaction.provider}</div>
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {
                        handleStatusChange(selectedTransaction.id, 'completed');
                      }}>
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        handleStatusChange(selectedTransaction.id, 'processing');
                      }}>
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        Mark as Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        handleStatusChange(selectedTransaction.id, 'pending');
                      }}>
                        <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        handleStatusChange(selectedTransaction.id, 'failed');
                      }}>
                        <XCircle className="h-4 w-4 mr-2 text-red-600" />
                        Mark as Failed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
