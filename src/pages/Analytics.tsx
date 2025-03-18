
import React, { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { Loader2, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import TransactionAnalytics from '@/components/analytics/TransactionAnalytics';
import { Card, CardContent } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BottomNavigation from '@/components/BottomNavigation';
import { format, subDays, subMonths } from 'date-fns';
import PageTransition from '@/components/PageTransition';

const Analytics = () => {
  const { transactions, loading } = useTransactions();
  const [timeframe, setTimeframe] = useState<'last7days' | 'last30days' | 'last3months' | 'custom'>('last30days');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  // Filter transactions based on date range
  const filteredTransactions = React.useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    
    let fromDate: Date;
    let toDate = new Date();
    
    switch (timeframe) {
      case 'last7days':
        fromDate = subDays(new Date(), 7);
        break;
      case 'last30days':
        fromDate = subDays(new Date(), 30);
        break;
      case 'last3months':
        fromDate = subMonths(new Date(), 3);
        break;
      case 'custom':
        fromDate = dateRange.from || subDays(new Date(), 30);
        toDate = dateRange.to || new Date();
        break;
      default:
        fromDate = subDays(new Date(), 30);
    }
    
    return transactions.filter(tx => {
      const txDate = tx.createdAt instanceof Date 
        ? tx.createdAt 
        : new Date(tx.createdAt);
      
      return txDate >= fromDate && txDate <= toDate;
    });
  }, [transactions, timeframe, dateRange]);
  
  return (
    <PageTransition>
      <div className="flex flex-col">
        <Header title="Analytics" showBackButton />
        
        <div className="p-4 flex-1">
          <div className="mb-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary-700">Transaction Analytics</h2>
              <Select 
                value={timeframe} 
                onValueChange={(value) => setTimeframe(value as any)}
              >
                <SelectTrigger className="w-[160px] border-primary-200 bg-primary-50/50">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="last3months">Last 3 months</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {timeframe === 'custom' && (
              <Card className="analytics-card primary-border">
                <CardContent className="p-3">
                  <div className="flex gap-2 items-center">
                    <Calendar className="h-5 w-5 text-primary-500" />
                    <DatePicker 
                      value={dateRange} 
                      onChange={setDateRange} 
                      className="w-full" 
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="text-sm text-muted-foreground pl-2 mt-1">
              {timeframe === 'custom' ? (
                <span>
                  {dateRange.from && dateRange.to 
                    ? `${format(dateRange.from, 'PPP')} - ${format(dateRange.to, 'PPP')}` 
                    : 'Select a date range'}
                </span>
              ) : (
                <span>
                  Showing data from {format(
                    timeframe === 'last7days' 
                      ? subDays(new Date(), 7) 
                      : timeframe === 'last30days' 
                        ? subDays(new Date(), 30) 
                        : subMonths(new Date(), 3), 
                    'PPP'
                  )} to {format(new Date(), 'PPP')}
                </span>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <TransactionAnalytics 
              transactions={filteredTransactions} 
              className="analytics-card"
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Analytics;
