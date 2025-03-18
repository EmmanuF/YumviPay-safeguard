
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  DashboardHeader,
  LoadingState,
  ErrorState,
  StatCards,
  TransactionCharts,
  InfoCards
} from '@/components/admin/dashboard';

// Mock data - will be replaced with real data from API
const mockTransactionData = [
  { name: 'Jan', transactions: 12, amount: 1230 },
  { name: 'Feb', transactions: 19, amount: 2410 },
  { name: 'Mar', transactions: 15, amount: 1800 },
  { name: 'Apr', transactions: 22, amount: 2700 },
  { name: 'May', transactions: 28, amount: 3200 },
  { name: 'Jun', transactions: 25, amount: 2900 },
];

const AdminDashboard = () => {
  console.log('Rendering AdminDashboard component');
  
  // This will be replaced with actual API calls
  const { data: dashboardStats, isLoading, error } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      console.log('Fetching admin dashboard stats');
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return {
        users: 567,
        transactions: 1256,
        growth: 23.1,
        alerts: 5
      };
    },
  });
  
  console.log('Dashboard query state:', { isLoading, error, hasData: !!dashboardStats });

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <DashboardHeader />
        
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : (
          <>
            <StatCards stats={dashboardStats!} />
            <TransactionCharts transactionData={mockTransactionData} />
            <InfoCards />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
