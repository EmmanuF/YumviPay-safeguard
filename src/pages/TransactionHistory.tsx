
import React from 'react';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import { TransactionsList, SearchAndFilter } from '@/components/history';
import { useTransactions } from '@/hooks/useTransactions';

const TransactionHistory: React.FC = () => {
  const { transactions, isLoading, error } = useTransactions();

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Transaction History" showBackButton />
        
        <main className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            <SearchAndFilter />
            
            <TransactionsList 
              transactions={transactions} 
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default TransactionHistory;
