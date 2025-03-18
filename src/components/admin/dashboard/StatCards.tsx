
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.users || 0}</div>
          <p className="text-xs text-muted-foreground">
            Total registered users
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <CreditCard className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.transactions || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.transactionVolume || '$0.00'} total volume
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.growth || 0}%</div>
          <p className="text-xs text-muted-foreground">
            Month-over-month increase
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Alerts</CardTitle>
          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.alerts || 0}</div>
          <p className="text-xs text-muted-foreground">
            Items requiring attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
