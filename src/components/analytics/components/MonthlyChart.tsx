
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface MonthlyChartProps {
  monthlyData: Array<{
    month: string;
    count: number;
  }>;
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ monthlyData }) => {
  return (
    <div className="pt-4 px-4 analytics-tab-content">
      <Card className="analytics-card info-border">
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f0f0f0'
                }}
              />
              <Bar 
                dataKey="count" 
                name="Transactions" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyChart;
