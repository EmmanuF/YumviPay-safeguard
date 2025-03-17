
import React from 'react';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import { TransactionsList } from '@/components/history';
import { useTransactions } from '@/hooks/useTransactions';

const TransactionHistory: React.FC = () => {
  const { transactions, loading, refreshTransactions } = useTransactions();

  const handleTransactionClick = (transactionId: string) => {
    window.location.href = `/transaction/${transactionId}`;
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Transaction History" showBackButton />
        
        <main className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* SearchAndFilter would go here if needed */}
            
            <TransactionsList 
              filteredTransactions={transactions}
              isLoading={loading}
              onTransactionClick={handleTransactionClick}
            />
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default TransactionHistory;
