
import React from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import HeaderRight from '@/components/HeaderRight';
import QuickTransferPanel from '@/components/quick-transfer/QuickTransferPanel';
import { BalanceCard, QuickLinks, RecentTransactions } from '@/components/dashboard';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import LoadingState from '@/components/dashboard/LoadingState';
import { useDashboard } from '@/hooks/useDashboard';

const Dashboard = () => {
  const { user, isLoading, transactions } = useDashboard();
  
  // Item animation variants for staggered animations
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-white pb-16">
      <Header 
        title="Dashboard" 
        showNotification 
        rightContent={<HeaderRight showNotification />}
      />
      
      <DashboardContainer>
        {/* Balance Card */}
        <BalanceCard 
          userName={user?.name} 
          transactions={transactions} 
          itemVariants={itemVariants} 
        />
        
        {/* Quick Transfer Panel */}
        <QuickLinks itemVariants={itemVariants} />
        
        {/* Quick Transfer Panel */}
        <QuickTransferPanel />
        
        {/* Recent Transactions */}
        <RecentTransactions 
          transactions={transactions} 
          itemVariants={itemVariants} 
        />
      </DashboardContainer>
      
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
