
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAuthState } from '@/services/auth';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import TransactionCard from '@/components/TransactionCard';
import { Transaction } from '@/types/transaction';
import QuickTransferPanel from '@/components/quick-transfer/QuickTransferPanel';
import HeaderRight from '@/components/HeaderRight';
import { useNotifications } from '@/contexts/NotificationContext';
import { BalanceCard, QuickLinks, RecentTransactions } from '@/components/dashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { user, isAuthenticated } = await getAuthState();
        
        if (!isAuthenticated) {
          navigate('/');
          return;
        }
        
        setUser(user);
        
        // Mock transaction data for demo purposes
        const mockTransactions: Transaction[] = [
          {
            id: 'tx_123456',
            amount: '500',
            currency: 'USD',
            recipientName: 'John Doe',
            recipientCountry: 'Nigeria',
            recipientCountryCode: 'NG',
            status: 'completed',
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            type: 'send',
            createdAt: new Date(Date.now() - 86400000),
            country: 'Nigeria'
          },
          {
            id: 'tx_123457',
            amount: '200',
            currency: 'USD',
            recipientName: 'Sarah Johnson',
            recipientCountry: 'Kenya',
            recipientCountryCode: 'KE',
            status: 'pending',
            date: new Date().toISOString(),
            type: 'send',
            createdAt: new Date(),
            country: 'Kenya'
          },
        ];
        
        setTransactions(mockTransactions);
        
        // Simulate receiving a transaction status update
        setTimeout(() => {
          addNotification({
            title: 'Transaction Update',
            message: 'Your transfer of $200 to Sarah Johnson is processing.',
            type: 'info',
            transactionId: 'tx_123457'
          });
        }, 3000);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate, addNotification]);
  
  // Fade in animation for sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-subtle">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-white pb-16">
      <Header 
        title="Dashboard" 
        showNotification 
        rightContent={<HeaderRight showNotification />}
      />
      
      <div className="px-4 py-2 flex-1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md mx-auto"
        >
          {/* Balance Card */}
          <BalanceCard 
            userName={user?.name} 
            transactions={transactions} 
            itemVariants={itemVariants} 
          />
          
          {/* Quick Transfer Panel */}
          <motion.div variants={itemVariants} className="mb-6">
            <QuickTransferPanel />
          </motion.div>
          
          {/* Quick Links */}
          <QuickLinks itemVariants={itemVariants} />
          
          {/* Recent Transactions */}
          <RecentTransactions 
            transactions={transactions} 
            itemVariants={itemVariants} 
          />
        </motion.div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
