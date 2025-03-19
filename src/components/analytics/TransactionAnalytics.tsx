
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
      <Card 
        className={`${className} h-[300px] flex items-center justify-center`}
        gradient="blue"
      >
        <CardContent>
          <p className="text-center text-muted-foreground">
            No transaction data available yet. Start sending money to see your analytics.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card 
      className={`${className} analytics-card`}
      gradient="teal"
      hoverEffect={true}
    >
      <CardHeader className="bg-gradient-to-br from-primary-50 to-white border-b border-primary-100">
        <CardTitle className="text-primary-800">Transaction Analytics</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="overview" className="analytics-tabs">
          <TabsList className="grid w-full grid-cols-3 p-1 rounded-lg bg-secondary-50/80 mb-4">
            <TabsTrigger 
              value="overview" 
              className="py-2 data-[state=active]:bg-primary-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="monthly"
              className="py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger 
              value="status" 
              className="py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Status
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4 px-4 analytics-tab-content">
            <div className="analytics-stat-grid">
              <div className="stats-card purple">
                <p className="text-sm font-medium text-primary-600 mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-primary-700">{transactions.length}</p>
              </div>
              <div className="stats-card green">
                <p className="text-sm font-medium text-green-600 mb-1">Total Amount Sent</p>
                <p className="text-2xl font-bold text-green-700">${totalAmountSent.toFixed(2)}</p>
              </div>
              <div className="stats-card blue">
                <p className="text-sm font-medium text-blue-600 mb-1">Completed Transactions</p>
                <p className="text-2xl font-bold text-blue-700">
                  {transactions.filter(tx => tx.status === 'completed').length}
                </p>
              </div>
              <div className="stats-card orange">
                <p className="text-sm font-medium text-orange-600 mb-1">Most Frequent Recipient</p>
                <p className="text-lg font-bold text-orange-700 truncate">{mostFrequentRecipient.name}</p>
                <p className="text-xs text-orange-500">{mostFrequentRecipient.count} transactions</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="pt-4 px-4 analytics-tab-content">
            <Card className="analytics-card info-border">
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #f0f0f0'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      name="Transactions" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="status" className="pt-4 px-4 analytics-tab-content">
            <Card className="analytics-card success-border">
              <CardContent className="pt-6">
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
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #f0f0f0'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TransactionAnalytics;
