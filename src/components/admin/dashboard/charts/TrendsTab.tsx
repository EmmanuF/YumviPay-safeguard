
import React from 'react';
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TransactionSummary } from '../TransactionCharts';

interface TrendsTabProps {
  transactionData: TransactionSummary[];
}

const TrendsTab: React.FC<TrendsTabProps> = ({ transactionData }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold">Growth Trends</h3>
        <p className="text-sm text-muted-foreground">
          Combined view of transactions and volume
        </p>
      </div>
      <div className="pt-4">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={transactionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis yAxisId="left" orientation="left" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '8px', 
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}  
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="transactions" 
              name="Transactions"
              stroke="#7c3aed" 
              strokeWidth={2}
              dot={{ r: 4, fill: "#7c3aed" }}
              activeDot={{ r: 6, fill: "#7c3aed", stroke: "white", strokeWidth: 2 }} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="amount" 
              name="Volume (USD)"
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 4, fill: "#10b981" }}
              activeDot={{ r: 6, fill: "#10b981", stroke: "white", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendsTab;
