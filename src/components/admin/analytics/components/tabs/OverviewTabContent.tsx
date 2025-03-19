
import React from 'react';
import { 
  LineChart, 
  PieChart, 
  BarChart,
  ResponsiveContainer, 
  Line, 
  Pie, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Custom colors
const COLORS = ['#6E36E5', '#10b981', '#f97316', '#3b82f6', '#ef4444'];

interface OverviewTabContentProps {
  userGrowthData: Array<{ name: string; users: number }>;
  statusData: Array<{ name: string; value: number }>;
  countryChartData: Array<{ name: string; count: number }>;
}

export const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  userGrowthData,
  statusData,
  countryChartData
}) => {
  return (
    <>
      <Card coloredBorder="primary" hoverEffect={true}>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Monthly user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#6E36E5" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card coloredBorder="success" hoverEffect={true}>
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} transactions`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card coloredBorder="info" hoverEffect={true}>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Transaction distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryChartData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6E36E5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
