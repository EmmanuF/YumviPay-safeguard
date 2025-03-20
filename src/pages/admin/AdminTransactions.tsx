
import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { 
  getAdminTransactions, 
  adminUpdateTransactionStatus,
  getTransactionStatistics 
} from '@/services/admin/adminTransactionService';

// Lazy loaded components
const TransactionHeader = lazy(() => import('@/components/admin/transactions/TransactionHeader'));
const StatisticsCards = lazy(() => import('@/components/admin/transactions/StatisticsCards'));
const TransactionList = lazy(() => import('@/components/admin/transactions/TransactionList'));
const TransactionDetails = lazy(() => import('@/components/admin/transactions/TransactionDetails'));
const TransactionAnalytics = lazy(() => import('@/components/admin/transactions/TransactionAnalytics'));

// Loading component
const ComponentLoader = () => (
  <div className="flex justify-center py-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const AdminTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Fetch transactions with optimized settings
  const { 
    data: transactions = [], 
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
    error: transactionsError
  } = useQuery({
    queryKey: ['adminTransactions'],
    queryFn: getAdminTransactions,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
  
  // Fetch transaction statistics with optimized settings
  const {
    data: statistics,
    isLoading: statsLoading,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['transactionStatistics'],
    queryFn: getTransactionStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
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
  
  // Filter and sort transactions (memoize this operation)
  const filteredTransactions = React.useMemo(() => {
    return transactions
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
  }, [transactions, searchTerm, statusFilter, sortField, sortDirection]);
  
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
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <Suspense fallback={<ComponentLoader />}>
          <TransactionHeader 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onExport={handleExport}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </Suspense>
        
        {/* Transaction statistics cards */}
        {!statsLoading && statistics && (
          <Suspense fallback={<ComponentLoader />}>
            <StatisticsCards statistics={statistics} />
          </Suspense>
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
                <Suspense fallback={<ComponentLoader />}>
                  <TransactionList 
                    transactions={transactions}
                    filteredTransactions={filteredTransactions}
                    isLoading={transactionsLoading}
                    error={transactionsError}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    toggleSort={toggleSort}
                    onViewTransaction={(transaction) => {
                      setSelectedTransaction(transaction);
                      setIsDetailsOpen(true);
                    }}
                  />
                </Suspense>
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
                <Suspense fallback={<ComponentLoader />}>
                  <TransactionAnalytics 
                    statistics={statistics}
                    isLoading={statsLoading}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Transaction Details Dialog */}
        <Suspense fallback={null}>
          <TransactionDetails 
            transaction={selectedTransaction}
            isOpen={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            onStatusChange={handleStatusChange}
          />
        </Suspense>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
