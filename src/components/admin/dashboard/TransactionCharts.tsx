
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Transaction summary type
export interface TransactionSummary {
  name: string;
  transactions: number;
  amount: number;
}

interface TransactionChartsProps {
  transactionData: TransactionSummary[];
}

const TransactionCharts: React.FC<TransactionChartsProps> = ({ transactionData }) => {
  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <Tabs defaultValue="transactions" className="space-y-8">
        <TabsList 
          variant="pills" 
          className="w-full grid grid-cols-3 gap-4 mb-8 bg-gray-50 p-2 rounded-lg overflow-visible shadow-sm"
        >
          <TabsTrigger 
            variant="pills" 
            value="transactions" 
            className="py-3 px-4 font-medium text-sm transition-all duration-200 hover:bg-primary-100/50 rounded-md overflow-hidden"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger 
            variant="pills" 
            value="volume" 
            className="py-3 px-4 font-medium text-sm transition-all duration-200 hover:bg-emerald-100/50 rounded-md overflow-hidden"
          >
            Volume
          </TabsTrigger>
          <TabsTrigger 
            variant="pills" 
            value="trends" 
            className="py-3 px-4 font-medium text-sm transition-all duration-200 hover:bg-blue-100/50 rounded-md overflow-hidden"
          >
            Trends
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4 animate-fade-in">
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
        </TabsContent>
        
        <TabsContent value="volume" className="space-y-4 animate-fade-in">
          <div>
            <h3 className="text-lg font-semibold">Transaction Volume</h3>
            <p className="text-sm text-muted-foreground">
              Monthly transaction volume in USD
            </p>
          </div>
          <div className="pt-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={transactionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} />
                <YAxis tick={{ fill: '#888', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => {
                    return typeof value === 'number' ? `$${value.toFixed(2)}` : `$${value}`;
                  }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px', 
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                  }}  
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar 
                  dataKey="amount" 
                  name="Volume (USD)" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4 animate-fade-in">
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
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TransactionCharts;
