
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
import { 
  getAdminDashboardStats, 
  getTransactionSummaryByMonth,
  getAdminRecentTransactions,
  getSystemStatusMetrics
} from '@/services/admin/adminDataService';

const AdminDashboard = () => {
  console.log('Rendering AdminDashboard component');
  
  // Fetch dashboard stats
  const { 
    data: dashboardStats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: getAdminDashboardStats,
  });
  
  // Fetch transaction summary data for charts
  const { 
    data: transactionData = [], 
    isLoading: chartLoading, 
    error: chartError 
  } = useQuery({
    queryKey: ['adminTransactionSummary'],
    queryFn: () => getTransactionSummaryByMonth(6),
  });
  
  // Fetch recent transactions
  const { 
    data: recentTransactions = [], 
    isLoading: txLoading, 
    error: txError 
  } = useQuery({
    queryKey: ['adminRecentTransactions'],
    queryFn: () => getAdminRecentTransactions(5),
  });
  
  // Fetch system status
  const { 
    data: systemStatus, 
    isLoading: systemLoading, 
    error: systemError 
  } = useQuery({
    queryKey: ['adminSystemStatus'],
    queryFn: getSystemStatusMetrics,
  });
  
  // Combine loading states
  const isLoading = statsLoading || chartLoading || txLoading || systemLoading;
  
  // Combine errors
  const error = statsError || chartError || txError || systemError;
  
  console.log('Dashboard data:', { 
    hasStats: !!dashboardStats, 
    txDataLength: transactionData?.length,
    recentTxLength: recentTransactions?.length,
    hasSystemStatus: !!systemStatus,
    isLoading,
    hasError: !!error
  });

  return (
    <AdminLayout pageTitle="Admin Dashboard">
      <div className="flex flex-col space-y-6">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : (
          <>
            <StatCards stats={dashboardStats!} />
            <TransactionCharts transactionData={transactionData} />
            <InfoCards 
              recentTransactions={recentTransactions} 
              systemStatus={systemStatus} 
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
