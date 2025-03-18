
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatUtils';

interface InfoCardsProps {
  recentTransactions: Array<{
    id: string;
    user: string;
    amount: string;
    date: string;
    status: string;
  }>;
  systemStatus: {
    cpu: number;
    memory: number;
    storage: number;
    uptime: string;
    lastUpdated: string;
  };
}

const InfoCards: React.FC<InfoCardsProps> = ({ recentTransactions = [], systemStatus }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card hoverEffect className="border-t-4 border-t-primary-500">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest transaction activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent transactions found</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{tx.user}</TableCell>
                      <TableCell>{tx.amount}</TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card hoverEffect className="border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current system performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!systemStatus ? (
            <p className="text-muted-foreground text-sm">System status data unavailable</p>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">CPU Usage</p>
                  <p className="text-sm font-medium">{systemStatus.cpu}%</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-500" 
                    style={{ width: `${systemStatus.cpu}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Memory Usage</p>
                  <p className="text-sm font-medium">{systemStatus.memory}%</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-purple-500 rounded-full transition-all duration-500" 
                    style={{ width: `${systemStatus.memory}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Storage Usage</p>
                  <p className="text-sm font-medium">{systemStatus.storage}%</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-green-500 rounded-full transition-all duration-500" 
                    style={{ width: `${systemStatus.storage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm pt-2 border-t">
                <p className="text-muted-foreground">System Uptime: <span className="font-medium text-foreground">{systemStatus.uptime}</span></p>
                <p className="text-muted-foreground">Last Updated: <span className="font-medium text-foreground">{formatDate(new Date(systemStatus.lastUpdated))}</span></p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoCards;
