
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TransactionSuccessStep from './TransactionSuccessStep';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

const TransactionCompletePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transactionData, setTransactionData] = React.useState<any>(null);
  
  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }
    
    // Try to get transaction data from storage
    try {
      const storedData = localStorage.getItem(`transaction_${id}`);
      if (storedData) {
        setTransactionData(JSON.parse(storedData));
      } else {
        // Try backup sources
        const backupData = localStorage.getItem('pendingTransaction') || 
                         localStorage.getItem('pendingKadoTransaction');
        
        if (backupData) {
          setTransactionData(JSON.parse(backupData));
        }
      }
    } catch (e) {
      console.error('Error loading transaction data:', e);
    }
  }, [id, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Success" showBackButton onBackClick={() => navigate('/dashboard')} />
      
      <div className="flex-1 p-4 md:p-6 max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <TransactionSuccessStep 
            transactionId={id || ''}
            recipientName={transactionData?.recipientName}
            amount={transactionData?.amount}
            currency={transactionData?.sourceCurrency}
          />
        </motion.div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default TransactionCompletePage;
