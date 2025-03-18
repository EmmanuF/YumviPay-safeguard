
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
    <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-semibold text-primary-700">Transaction Analytics</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="w-full max-w-md mx-auto mb-2">
            <TabsTrigger value="transactions" className="flex-1">Transactions</TabsTrigger>
            <TabsTrigger value="volume" className="flex-1">Volume</TabsTrigger>
            <TabsTrigger value="trends" className="flex-1">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-primary-700">Transaction Overview</h4>
              <p className="text-xs text-muted-foreground">
                Monthly transaction count over the past 6 months
              </p>
            </div>
            <div className="rounded-md border p-3 bg-card/50">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={transactionData}>
                  <defs>
                    <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      borderColor: '#e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="transactions" 
                    name="Number of Transactions" 
                    fill="url(#colorTransactions)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="volume" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-primary-700">Transaction Volume</h4>
              <p className="text-xs text-muted-foreground">
                Monthly transaction volume in USD
              </p>
            </div>
            <div className="rounded-md border p-3 bg-card/50">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={transactionData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value) => {
                      return typeof value === 'number' ? `$${value.toFixed(2)}` : `$${value}`;
                    }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      borderColor: '#e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name="Volume (USD)" 
                    fill="url(#colorAmount)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-primary-700">Growth Trends</h4>
              <p className="text-xs text-muted-foreground">
                Combined view of transactions and volume
              </p>
            </div>
            <div className="rounded-md border p-3 bg-card/50">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={transactionData}>
                  <defs>
                    <linearGradient id="colorTrans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      borderColor: '#e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="transactions" 
                    name="Transactions"
                    stroke="#7c3aed" 
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="amount" 
                    name="Volume (USD)"
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TransactionCharts;
