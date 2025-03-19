
import React from 'react';
import { Transaction } from '@/types/transaction';

interface OverviewContentProps {
  transactions: Transaction[];
  totalAmountSent: number;
  mostFrequentRecipient: {
    name: string;
    count: number;
  };
}

const OverviewContent: React.FC<OverviewContentProps> = ({ 
  transactions, 
  totalAmountSent, 
  mostFrequentRecipient 
}) => {
  return (
    <div className="space-y-4 pt-4 px-4 analytics-tab-content">
      <div className="analytics-stat-grid">
        <div className="stats-card purple">
          <p className="text-sm font-medium text-primary-600 mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-primary-700">{transactions.length}</p>
        </div>
        <div className="stats-card green">
          <p className="text-sm font-medium text-green-600 mb-1">Total Amount Sent</p>
          <p className="text-2xl font-bold text-green-700">${totalAmountSent.toFixed(2)}</p>
        </div>
        <div className="stats-card blue">
          <p className="text-sm font-medium text-blue-600 mb-1">Completed Transactions</p>
          <p className="text-2xl font-bold text-blue-700">
            {transactions.filter(tx => tx.status === 'completed').length}
          </p>
        </div>
        <div className="stats-card orange">
          <p className="text-sm font-medium text-orange-600 mb-1">Most Frequent Recipient</p>
          <p className="text-lg font-bold text-orange-700 truncate">{mostFrequentRecipient.name}</p>
          <p className="text-xs text-orange-500">{mostFrequentRecipient.count} transactions</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;
