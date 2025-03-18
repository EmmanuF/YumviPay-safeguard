
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  ResponsiveContainer, 
  Bar, 
  Line, 
  Pie, 
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import { getAdminTransactions } from '@/services/admin/adminTransactionService';
import { getAdminUsers } from '@/services/admin/adminUserService';

// Custom colors
const COLORS = ['#6E36E5', '#10b981', '#f97316', '#3b82f6', '#ef4444'];

const AnalyticsDashboard = () => {
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['adminTransactionsForAnalytics'],
    queryFn: getAdminTransactions,
  });
  
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsersForAnalytics'],
    queryFn: getAdminUsers,
  });
  
  const isLoading = transactionsLoading || usersLoading;
  
  // Create transaction status counts
  const statusCounts = transactions.reduce((acc: any, transaction: any) => {
    acc[transaction.status] = (acc[transaction.status] || 0) + 1;
    return acc;
  }, {});
  
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  
  // Create transaction by country data
  const countryData = transactions.reduce((acc: any, transaction: any) => {
    const country = transaction.country;
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});
  
  const countryChartData = Object.entries(countryData)
    .map(([name, value]) => ({ name, count: value }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 5); // Top 5 countries
  
  // Generate some mock user growth data by month
  const userGrowthData = [
    { name: 'Jan', users: 20 },
    { name: 'Feb', users: 45 },
    { name: 'Mar', users: 78 },
    { name: 'Apr', users: 125 },
    { name: 'May', users: 183 },
    { name: 'Jun', users: 247 },
  ];
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Transactions</CardTitle>
            <CardDescription>All processed transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +23% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Transaction Volume</CardTitle>
            <CardDescription>Total amount processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$327,591</div>
            <p className="text-xs text-muted-foreground mt-1">
              +18% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Countries</CardTitle>
            <CardDescription>Countries with transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Object.keys(countryData).length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 new countries this month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
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
            <Card>
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
            
            <Card>
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
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume Over Time</CardTitle>
              <CardDescription>Monthly transaction amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { month: 'Jan', amount: 12500 },
                    { month: 'Feb', amount: 18600 },
                    { month: 'Mar', amount: 27400 },
                    { month: 'Apr', amount: 39200 },
                    { month: 'May', amount: 48300 },
                    { month: 'Jun', amount: 58200 },
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Acquisition</CardTitle>
              <CardDescription>New user registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { month: 'Jan', newUsers: 22, activeUsers: 18 },
                    { month: 'Feb', newUsers: 25, activeUsers: 32 },
                    { month: 'Mar', newUsers: 33, activeUsers: 45 },
                    { month: 'Apr', newUsers: 47, activeUsers: 62 },
                    { month: 'May', newUsers: 58, activeUsers: 78 },
                    { month: 'Jun', newUsers: 64, activeUsers: 95 },
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        </TabsContent>
        
        <TabsContent value="countries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Transaction Countries</CardTitle>
              <CardDescription>Distribution by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Transactions" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
