
import React from 'react';
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TransactionSummary } from '../TransactionCharts';

interface TransactionsTabProps {
  transactionData: TransactionSummary[];
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ transactionData }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold">Transaction Overview</h3>
        <p className="text-sm text-muted-foreground">
          Monthly transaction count over the past 6 months
        </p>
      </div>
      <div className="pt-4">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={transactionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '8px', 
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }} 
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar 
              dataKey="transactions" 
              name="Number of Transactions" 
              fill="#7c3aed" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionsTab;
