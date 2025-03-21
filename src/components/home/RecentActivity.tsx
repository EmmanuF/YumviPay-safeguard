
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

interface RecentActivityProps {
  className?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ className }) => {
  const navigate = useNavigate();
  
  // Placeholder transactions for demonstration
  const transactions = [
    { id: 'tx-1', recipient: 'Sarah Johnson', amount: 50, currency: 'USD', date: '2023-08-15', status: 'completed' },
    { id: 'tx-2', recipient: 'Michael Chen', amount: 100, currency: 'USD', date: '2023-08-10', status: 'pending' }
  ];
  
  if (transactions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Calendar className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No recent transactions</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex justify-between items-center p-3 bg-background rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/transaction/${tx.id}`)}
            >
              <div>
                <p className="font-medium text-sm">{tx.recipient}</p>
                <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{tx.amount} {tx.currency}</p>
                <p className={`text-xs ${tx.status === 'completed' ? 'text-green-500' : 'text-amber-500'}`}>
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
