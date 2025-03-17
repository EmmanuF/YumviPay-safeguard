
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CircleDollarSign, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for demonstration
const MOCK_MONTHLY_DATA = [
  { month: 'Jan', amount: 120 },
  { month: 'Feb', amount: 240 },
  { month: 'Mar', amount: 180 },
  { month: 'Apr', amount: 300 },
  { month: 'May', amount: 210 },
  { month: 'Jun', amount: 450 },
];

const MOCK_FEE_SAVINGS = [
  { name: 'Saved', value: 48 },
  { name: 'Paid', value: 12 },
];

const MOCK_TRANSFER_DESTINATIONS = [
  { name: 'Nigeria', value: 45 },
  { name: 'Ghana', value: 25 },
  { name: 'Cameroon', value: 30 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ActivityAnalyticsProps {
  userId: string;
}

const ActivityAnalytics: React.FC<ActivityAnalyticsProps> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('spending');
  
  useEffect(() => {
    // Simulate API call to fetch analytics data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [userId]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="w-full h-[300px]" />
            <div className="flex justify-between">
              <Skeleton className="w-[100px] h-8" />
              <Skeleton className="w-[100px] h-8" />
              <Skeleton className="w-[100px] h-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Activity Analytics</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => setIsLoading(true)}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeChart} onValueChange={setActiveChart}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="spending" className="text-xs">
              <TrendingUp className="h-4 w-4 mr-1" />
              Spending Trends
            </TabsTrigger>
            <TabsTrigger value="destinations" className="text-xs">
              <TrendingDown className="h-4 w-4 mr-1" />
              Destinations
            </TabsTrigger>
            <TabsTrigger value="fees" className="text-xs">
              <DollarSign className="h-4 w-4 mr-1" />
              Fee Savings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="spending" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Amount']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar dataKey="amount" fill="#8884d8" name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-primary-700 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Total Sent
                </h3>
                <p className="text-2xl font-bold mt-2">$1,500</p>
                <p className="text-xs text-primary-600 mt-1">Last 6 months</p>
              </div>
              
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-primary-700 flex items-center">
                  <CircleDollarSign className="h-4 w-4 mr-1" />
                  Avg. Transaction
                </h3>
                <p className="text-2xl font-bold mt-2">$250</p>
                <p className="text-xs text-primary-600 mt-1">Last 6 months</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="destinations" className="space-y-4">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_TRANSFER_DESTINATIONS}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {MOCK_TRANSFER_DESTINATIONS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {MOCK_TRANSFER_DESTINATIONS.map((item, index) => (
                <div key={item.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="fees" className="space-y-4">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_FEE_SAVINGS}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {MOCK_FEE_SAVINGS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-700 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Total Fees Saved
              </h3>
              <p className="text-2xl font-bold mt-2">$48</p>
              <p className="text-xs text-green-600 mt-1">80% less than traditional services</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityAnalytics;
