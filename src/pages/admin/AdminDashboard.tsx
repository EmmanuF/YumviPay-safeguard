
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAdvancedSettings } from '@/hooks/admin/settings/useAdvancedSettings';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Construction } from 'lucide-react';
import { 
  getAdminDashboardStats, 
  getTransactionSummaryByMonth,
  getAdminRecentTransactions,
  getSystemStatusMetrics
} from '@/services/admin/adminDataService';

const AdminDashboard = () => {
  console.log('Rendering AdminDashboard component');
  
  const { settings } = useAdvancedSettings();
  const maintenanceMode = settings.maintenanceMode;
  
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
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <DashboardHeader />
        
        {maintenanceMode && (
          <Alert className="border-2 border-yellow-400 bg-yellow-50">
            <Construction className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-700 font-bold flex items-center">
              System Under Maintenance 
              <Badge className="ml-2 bg-yellow-500">Active</Badge>
            </AlertTitle>
            <AlertDescription className="text-yellow-600">
              The system is currently in maintenance mode. Regular users cannot access the application.
            </AlertDescription>
          </Alert>
        )}
        
        {settings.debugMode && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-700">Debug Mode Enabled</AlertTitle>
            <AlertDescription className="text-blue-600">
              Detailed error information is being displayed. Disable in production environments.
            </AlertDescription>
          </Alert>
        )}
        
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
