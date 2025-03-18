
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, CreditCard, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

// Mock data - will be replaced with real data from API
const mockTransactionData = [
  { name: 'Jan', transactions: 12, amount: 1230 },
  { name: 'Feb', transactions: 19, amount: 2410 },
  { name: 'Mar', transactions: 15, amount: 1800 },
  { name: 'Apr', transactions: 22, amount: 2700 },
  { name: 'May', transactions: 28, amount: 3200 },
  { name: 'Jun', transactions: 25, amount: 2900 },
];

const AdminDashboard = () => {
  console.log('Rendering AdminDashboard component');
  
  // This will be replaced with actual API calls
  const { data: dashboardStats, isLoading, error } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      console.log('Fetching admin dashboard stats');
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return {
        users: 567,
        transactions: 1256,
        growth: 23.1,
        alerts: 5
      };
    },
  });
  
  console.log('Dashboard query state:', { isLoading, error, hasData: !!dashboardStats });

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-lg font-medium">Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>Error loading dashboard data. Please try again later.</p>
            <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.users || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +18% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.transactions || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.growth || 0}%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.5% from yesterday
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.alerts || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    -2 since yesterday
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="transactions" className="space-y-4">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="users">User Growth</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Overview</CardTitle>
                    <CardDescription>
                      View transaction volume and trends over the past 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={mockTransactionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="transactions" fill="#7c3aed" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>
                      New user registrations over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>User growth chart will be displayed here</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="revenue" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analysis</CardTitle>
                    <CardDescription>
                      Financial performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Revenue analysis will be displayed here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Latest transaction activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Recent transactions will be listed here</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>
                    Current system performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>System status indicators will be displayed here</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
