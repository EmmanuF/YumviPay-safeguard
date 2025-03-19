
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle, XCircle, Clock } from 'lucide-react';

interface TransactionAnalyticsProps {
  statistics: any;
  isLoading: boolean;
}

const TransactionAnalytics: React.FC<TransactionAnalyticsProps> = ({ 
  statistics, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No analytics data available
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" /> Completed
        </Badge>;
      case 'processing':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Processing
        </Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-400 bg-yellow-50 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Pending
        </Badge>;
      case 'failed':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Failed
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {statistics.byStatus && Object.entries(statistics.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {getStatusBadge(status)}
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Country Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Country Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {statistics.byCountry && Object.entries(statistics.byCountry)
              .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
              .slice(0, 5)
              .map(([country, count]) => (
                <div key={country} className="flex items-center justify-between mb-2">
                  <span className="text-sm">{country}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionAnalytics;
