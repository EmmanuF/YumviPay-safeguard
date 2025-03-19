
import React from 'react';
import { 
  BarChart, 
  ResponsiveContainer, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const TransactionsTabContent: React.FC = () => {
  // Mock data for transactions
  const transactionVolumeData = [
    { month: 'Jan', amount: 12500 },
    { month: 'Feb', amount: 18600 },
    { month: 'Mar', amount: 27400 },
    { month: 'Apr', amount: 39200 },
    { month: 'May', amount: 48300 },
    { month: 'Jun', amount: 58200 },
  ];

  return (
    <Card coloredBorder="success" hoverEffect={true}>
      <CardHeader>
        <CardTitle>Transaction Volume Over Time</CardTitle>
        <CardDescription>Monthly transaction amounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={transactionVolumeData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
              <Legend />
              <Bar dataKey="amount" name="Transaction Volume" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
