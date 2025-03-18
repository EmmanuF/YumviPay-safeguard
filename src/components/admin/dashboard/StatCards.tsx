
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatCardsProps {
  stats: {
    users: number;
    transactions: number;
    transactionVolume: string;
    growth: number;
    alerts: number;
  };
}

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-primary-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-400"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-primary-700">Total Users</CardTitle>
          <Users className="w-5 h-5 text-primary-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary-900">{stats?.users || 0}</div>
          <p className="text-xs text-primary-600 mt-1">
            Total registered users
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-400"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-blue-700">Transactions</CardTitle>
          <CreditCard className="w-5 h-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">{stats?.transactions || 0}</div>
          <p className="text-xs text-blue-600 mt-1">
            {stats?.transactionVolume || '$0.00'} total volume
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-green-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-400"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-green-700">Growth Rate</CardTitle>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900">{stats?.growth || 0}%</div>
          <p className="text-xs text-green-600 mt-1">
            Month-over-month increase
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-amber-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-amber-700">Alerts</CardTitle>
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-900">{stats?.alerts || 0}</div>
          <p className="text-xs text-amber-600 mt-1">
            Items requiring attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
