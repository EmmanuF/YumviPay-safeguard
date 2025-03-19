
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transaction } from '@/types/transaction';
import { useTransactionAnalytics } from './hooks/useTransactionAnalytics';
import EmptyState from './components/EmptyState';
import OverviewContent from './components/OverviewContent';
import MonthlyChart from './components/MonthlyChart';
import StatusChart from './components/StatusChart';

interface TransactionAnalyticsProps {
  transactions: Transaction[];
  className?: string;
}

const TransactionAnalytics: React.FC<TransactionAnalyticsProps> = ({ 
  transactions, 
  className = '' 
}) => {
  const {
    monthlyData,
    statusData,
    getStatusColor,
    totalAmountSent,
    mostFrequentRecipient
  } = useTransactionAnalytics(transactions);
  
  if (transactions.length === 0) {
    return <EmptyState className={className} />;
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
          
          <TabsContent value="overview">
            <OverviewContent 
              transactions={transactions}
              totalAmountSent={totalAmountSent}
              mostFrequentRecipient={mostFrequentRecipient}
            />
          </TabsContent>
          
          <TabsContent value="monthly">
            <MonthlyChart monthlyData={monthlyData} />
          </TabsContent>
          
          <TabsContent value="status">
            <StatusChart 
              statusData={statusData}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TransactionAnalytics;
