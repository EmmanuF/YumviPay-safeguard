
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Clock, User, Mail, AlertCircle } from 'lucide-react';
import { getAuthState } from '@/services/auth';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import TransactionCard, { Transaction } from '@/components/TransactionCard';
import QuickTransferPanel from '@/components/quick-transfer/QuickTransferPanel';
import HeaderRight from '@/components/HeaderRight';
import { useNotifications } from '@/contexts/NotificationContext';

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
            amount: 500,
            currency: 'USD',
            recipientName: 'John Doe',
            recipientCountry: 'Nigeria',
            recipientCountryCode: 'NG',
            status: 'completed',
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            type: 'send',
          },
          {
            id: 'tx_123457',
            amount: 200,
            currency: 'USD',
            recipientName: 'Sarah Johnson',
            recipientCountry: 'Kenya',
            recipientCountryCode: 'KE',
            status: 'pending',
            date: new Date().toISOString(),
            type: 'send',
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
          <motion.div variants={itemVariants} className="mb-6">
            <div className="glass-effect rounded-xl p-6 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-primary-100 text-sm font-medium mb-1">Welcome back</p>
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                </div>
                <div className="bg-white/20 rounded-full p-2">
                  <User className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-primary-100 text-sm">Recent Transfer</p>
                  <p className="text-2xl font-bold">
                    {transactions.length > 0 ? `$${transactions[0].amount}` : '$0'}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/send')}
                  className="bg-white text-primary-500 font-medium py-2 px-4 rounded-lg flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Send Money
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Quick Transfer Panel */}
          <motion.div variants={itemVariants} className="mb-6">
            <QuickTransferPanel />
          </motion.div>
          
          {/* Quick Links */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex justify-between">
              <button
                onClick={() => navigate('/send')}
                className="glass-effect rounded-xl p-4 flex-1 mr-2 flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-2">
                  <Mail className="w-5 h-5 text-primary-500" />
                </div>
                <span className="text-sm">New Transfer</span>
              </button>
              
              <button
                onClick={() => navigate('/history')}
                className="glass-effect rounded-xl p-4 flex-1 ml-2 flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-secondary-500" />
                </div>
                <span className="text-sm">History</span>
              </button>
            </div>
          </motion.div>
          
          {/* Recent Transactions */}
          <motion.div variants={itemVariants}>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Recent Transactions</h3>
            </div>
            
            {transactions.length === 0 ? (
              <div className="glass-effect rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No transactions yet</p>
                <button
                  onClick={() => navigate('/send')}
                  className="text-primary-500 font-medium"
                >
                  Send your first transfer
                </button>
              </div>
            ) : (
              <div>
                {transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onClick={() => navigate(`/transaction/${transaction.id}`)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
