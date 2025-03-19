
import React from 'react';
import { 
  LineChart, 
  ResponsiveContainer, 
  Line, 
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

export const UsersTabContent: React.FC = () => {
  // Mock data for user acquisition
  const userData = [
    { month: 'Jan', newUsers: 22, activeUsers: 18 },
    { month: 'Feb', newUsers: 25, activeUsers: 32 },
    { month: 'Mar', newUsers: 33, activeUsers: 45 },
    { month: 'Apr', newUsers: 47, activeUsers: 62 },
    { month: 'May', newUsers: 58, activeUsers: 78 },
    { month: 'Jun', newUsers: 64, activeUsers: 95 },
  ];

  return (
    <Card coloredBorder="primary" hoverEffect={true}>
      <CardHeader>
        <CardTitle>User Acquisition</CardTitle>
        <CardDescription>New user registrations over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={userData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#6E36E5" strokeWidth={2} />
              <Line type="monotone" dataKey="activeUsers" name="Active Users" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
