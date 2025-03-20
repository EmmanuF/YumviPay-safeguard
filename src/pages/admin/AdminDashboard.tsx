
import React, { Suspense, lazy } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { DashboardHeader, LoadingState, ErrorState } from '@/components/admin/dashboard';
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

// Lazy-load components that are not needed immediately
const StatCards = lazy(() => import('@/components/admin/dashboard/StatCards'));
const TransactionCharts = lazy(() => import('@/components/admin/dashboard/TransactionCharts'));
const InfoCards = lazy(() => import('@/components/admin/dashboard/InfoCards'));

const AdminDashboard = () => {
  console.log('Rendering AdminDashboard component');
  
  const { settings } = useAdvancedSettings();
  const maintenanceMode = settings.maintenanceMode;
  
  // Fetch dashboard stats with optimized configuration
  const { 
    data: dashboardStats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: getAdminDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
  // Fetch transaction summary data for charts
  const { 
    data: transactionData = [], 
    isLoading: chartLoading, 
    error: chartError 
  } = useQuery({
    queryKey: ['adminTransactionSummary'],
    queryFn: () => getTransactionSummaryByMonth(6),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
  
  // Fetch recent transactions
  const { 
    data: recentTransactions = [], 
    isLoading: txLoading, 
    error: txError 
  } = useQuery({
    queryKey: ['adminRecentTransactions'],
    queryFn: () => getAdminRecentTransactions(5),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
  
  // Fetch system status
  const { 
    data: systemStatus, 
    isLoading: systemLoading, 
    error: systemError 
  } = useQuery({
    queryKey: ['adminSystemStatus'],
    queryFn: getSystemStatusMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
  // Combine loading states
  const isLoading = statsLoading || chartLoading || txLoading || systemLoading;
  
  // Combine errors
  const error = statsError || chartError || txError || systemError;
  
  console.log('Dashboard data loading state:', isLoading);

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
            <Suspense fallback={<LoadingState />}>
              <StatCards stats={dashboardStats!} />
            </Suspense>
            
            <Suspense fallback={<LoadingState />}>
              <TransactionCharts transactionData={transactionData} />
            </Suspense>
            
            <Suspense fallback={<LoadingState />}>
              <InfoCards 
                recentTransactions={recentTransactions} 
                systemStatus={systemStatus} 
              />
            </Suspense>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
