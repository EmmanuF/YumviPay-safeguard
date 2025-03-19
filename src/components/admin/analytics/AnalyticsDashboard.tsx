
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { getAdminTransactions } from '@/services/admin/adminTransactionService';
import { getAdminUsers } from '@/services/admin/adminUserService';
import { AnalyticsStatCards } from './components/AnalyticsStatCards';
import { OverviewTabContent } from './components/tabs/OverviewTabContent';
import { TransactionsTabContent } from './components/tabs/TransactionsTabContent';
import { UsersTabContent } from './components/tabs/UsersTabContent';
import { CountriesTabContent } from './components/tabs/CountriesTabContent';

const AnalyticsDashboard = () => {
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['adminTransactionsForAnalytics'],
    queryFn: getAdminTransactions,
  });
  
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsersForAnalytics'],
    queryFn: getAdminUsers,
  });
  
  const isLoading = transactionsLoading || usersLoading;
  
  // Create transaction status counts
  const statusCounts = transactions.reduce((acc: any, transaction: any) => {
    acc[transaction.status] = (acc[transaction.status] || 0) + 1;
    return acc;
  }, {});
  
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  
  // Create transaction by country data
  const countryData = transactions.reduce((acc: any, transaction: any) => {
    const country = transaction.country;
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});
  
  const countryChartData = Object.entries(countryData)
    .map(([name, value]) => ({ name, count: value }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 5); // Top 5 countries
  
  // Generate some mock user growth data by month
  const userGrowthData = [
    { name: 'Jan', users: 20 },
    { name: 'Feb', users: 45 },
    { name: 'Mar', users: 78 },
    { name: 'Apr', users: 125 },
    { name: 'May', users: 183 },
    { name: 'Jun', users: 247 },
  ];
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <AnalyticsStatCards 
        usersCount={users.length}
        transactionsCount={transactions.length}
        countryCount={Object.keys(countryData).length}
      />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList 
          variant="gradient" 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full gap-1 p-1 rounded-lg bg-gradient-to-r from-primary-50/90 to-secondary-50/90 shadow-md backdrop-blur-sm"
        >
          <TabsTrigger 
            value="overview" 
            variant="pills"
            className="transition-all duration-300 hover:bg-white/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="transactions" 
            variant="pills"
            className="transition-all duration-300 hover:bg-white/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger 
            value="users" 
            variant="pills"
            className="transition-all duration-300 hover:bg-white/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Users
          </TabsTrigger>
          <TabsTrigger 
            value="countries" 
            variant="pills"
            className="transition-all duration-300 hover:bg-white/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            Countries
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 animate-slide-up">
          <OverviewTabContent 
            userGrowthData={userGrowthData} 
            statusData={statusData} 
            countryChartData={countryChartData} 
          />
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4 animate-slide-up">
          <TransactionsTabContent />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 animate-slide-up">
          <UsersTabContent />
        </TabsContent>
        
        <TabsContent value="countries" className="space-y-4 animate-slide-up">
          <CountriesTabContent countryChartData={countryChartData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
