
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatUtils';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, AlertTriangle, CheckCircle, HelpCircle, Gauge } from 'lucide-react';

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
    alerts?: Array<{
      level: 'info' | 'warning' | 'critical';
      message: string;
      time: string;
    }>;
    services?: Array<{
      name: string;
      status: 'operational' | 'degraded' | 'down';
      latency: number;
    }>;
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

  const getServiceStatusBadge = (status: 'operational' | 'degraded' | 'down') => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500">Degraded</Badge>;
      case 'down':
        return <Badge variant="destructive">Down</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAlertIcon = (level: 'info' | 'warning' | 'critical') => {
    switch (level) {
      case 'info':
        return <HelpCircle className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  // Mock data for demo
  const mockSystemAlerts = systemStatus?.alerts || [
    { level: 'warning', message: 'High CPU usage detected', time: '2h ago' },
    { level: 'info', message: 'Scheduled maintenance tonight', time: '3h ago' },
    { level: 'critical', message: 'Database connection issues', time: '1d ago' }
  ];

  const mockSystemServices = systemStatus?.services || [
    { name: 'API Gateway', status: 'operational', latency: 42 },
    { name: 'Authentication', status: 'operational', latency: 35 },
    { name: 'Database', status: 'degraded', latency: 153 },
    { name: 'Storage', status: 'operational', latency: 67 }
  ] as const;

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
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="flex flex-col border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-blue-500" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
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
                    className={`h-2 rounded-full transition-all duration-500 ${
                      systemStatus.cpu > 80 
                        ? 'bg-red-500' 
                        : systemStatus.cpu > 50 
                        ? 'bg-yellow-500' 
                        : 'bg-blue-500'
                    }`}
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
                    className={`h-2 rounded-full transition-all duration-500 ${
                      systemStatus.memory > 80 
                        ? 'bg-red-500' 
                        : systemStatus.memory > 50 
                        ? 'bg-yellow-500' 
                        : 'bg-purple-500'
                    }`}
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
                    className={`h-2 rounded-full transition-all duration-500 ${
                      systemStatus.storage > 80 
                        ? 'bg-red-500' 
                        : systemStatus.storage > 50 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${systemStatus.storage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Service Status</h4>
                <div className="space-y-2">
                  {mockSystemServices.map((service) => (
                    <div key={service.name} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/30">
                      <span>{service.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{service.latency}ms</span>
                        {getServiceStatusBadge(service.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Recent Alerts</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {mockSystemAlerts.map((alert, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-md bg-muted/30">
                      {getAlertIcon(alert.level)}
                      <div className="flex-1">
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between mt-auto text-sm text-muted-foreground">
          <p>System Uptime: <span className="font-medium text-foreground">{systemStatus?.uptime || 'Unknown'}</span></p>
          <p>Last Updated: <span className="font-medium text-foreground">{systemStatus ? formatDate(new Date(systemStatus.lastUpdated)) : 'Unknown'}</span></p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InfoCards;
