
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transaction } from '@/types/transaction';
import { format } from 'date-fns';

interface TransactionAnalyticsProps {
  transactions: Transaction[];
  className?: string;
}

const TransactionAnalytics: React.FC<TransactionAnalyticsProps> = ({ 
  transactions, 
  className = '' 
}) => {
  // Transform transactions for monthly analysis
  const monthlyData = useMemo(() => {
    const last6Months = new Map<string, number>();
    
    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = format(d, 'MMM');
      last6Months.set(monthName, 0);
    }
    
    // Count transactions per month
    transactions.forEach(tx => {
      const txDate = tx.createdAt instanceof Date ? tx.createdAt : new Date(tx.createdAt);
      const monthName = format(txDate, 'MMM');
      
      if (last6Months.has(monthName)) {
        last6Months.set(monthName, (last6Months.get(monthName) || 0) + 1);
      }
    });
    
    // Convert map to array for chart
    return Array.from(last6Months).map(([month, count]) => ({
      month,
      count
    }));
  }, [transactions]);
  
  // Transform transactions for status analysis
  const statusData = useMemo(() => {
    const statusCounts = new Map<string, number>();
    
    transactions.forEach(tx => {
      statusCounts.set(tx.status, (statusCounts.get(tx.status) || 0) + 1);
    });
    
    return Array.from(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [transactions]);
  
  // Get status colors
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FFC107';
      case 'processing': return '#2196F3';
      case 'failed': return '#F44336';
      case 'cancelled': return '#9E9E9E';
      case 'offline-pending': return '#FF9800';
      default: return '#9c27b0';
    }
  };
  
  // Calculate total amount sent
  const totalAmountSent = useMemo(() => {
    return transactions
      .filter(tx => tx.status === 'completed')
      .reduce((sum, tx) => sum + (typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount), 0);
  }, [transactions]);
  
  // Get most frequent recipient
  const mostFrequentRecipient = useMemo(() => {
    const recipientCounts = new Map<string, number>();
    
    transactions.forEach(tx => {
      if (tx.recipientName) {
        recipientCounts.set(tx.recipientName, (recipientCounts.get(tx.recipientName) || 0) + 1);
      }
    });
    
    let maxCount = 0;
    let maxRecipient = '';
    
    recipientCounts.forEach((count, recipient) => {
      if (count > maxCount) {
        maxCount = count;
        maxRecipient = recipient;
      }
    });
    
    return { name: maxRecipient, count: maxCount };
  }, [transactions]);
  
  if (transactions.length === 0) {
    return (
      <Card className={`${className} h-[300px] flex items-center justify-center`}>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No transaction data available yet. Start sending money to see your analytics.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Transaction Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Amount Sent</p>
                <p className="text-2xl font-bold">${totalAmountSent.toFixed(2)}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Completed Transactions</p>
                <p className="text-2xl font-bold">
                  {transactions.filter(tx => tx.status === 'completed').length}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Most Frequent Recipient</p>
                <p className="text-lg font-bold truncate">{mostFrequentRecipient.name}</p>
                <p className="text-sm text-muted-foreground">{mostFrequentRecipient.count} transactions</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="pt-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Transactions" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="status" className="pt-4">
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TransactionAnalytics;
