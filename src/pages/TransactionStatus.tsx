
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Header from '@/components/Header';
import HeaderRight from '@/components/HeaderRight';
import {
  StatusContent,
  ActionButtons,
  LoadingState,
  TransactionNotFound
} from '@/components/transaction';

interface TransactionDetails {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  amount: string;
  fee: string;
  totalAmount: string;
  recipient: string;
  date: string;
  estimatedDelivery: string;
}

const TransactionStatus = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API fetch for transaction details
    const fetchTransactionDetails = () => {
      setLoading(true);
      // Mock data - in a real app, this would be fetched from an API
      setTimeout(() => {
        setTransaction({
          id: id || '',
          status: 'completed',
          amount: '250.00',
          fee: '4.99',
          totalAmount: '254.99',
          recipient: '+234 701 234 5678',
          date: new Date().toLocaleDateString(),
          estimatedDelivery: '1-2 business days',
        });
        setLoading(false);
      }, 1000);
    };

    if (id) {
      fetchTransactionDetails();
    }
  }, [id]);

  const handleShareTransaction = () => {
    // In a real app, this would trigger native sharing
    alert('Sharing functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header 
          title="Transaction" 
          showBackButton={true} 
          rightContent={<HeaderRight showNotification />} 
        />
        <LoadingState />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header 
          title="Transaction" 
          showBackButton={true} 
          rightContent={<HeaderRight showNotification />} 
        />
        <TransactionNotFound />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Transaction Receipt" 
        showBackButton={true} 
        rightContent={<HeaderRight showNotification />} 
      />
      
      <div className="flex-1 p-4">
        <StatusContent transaction={transaction} />
        
        <div className="mt-6">
          <ActionButtons handleShareTransaction={handleShareTransaction} />
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
