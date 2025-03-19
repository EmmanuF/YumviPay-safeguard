
import React from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { ArrowDownUp, Receipt, CheckCircle2, Clock } from 'lucide-react';

interface StatisticsCardsProps {
  statistics: any;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics }) => {
  if (!statistics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <h4 className="text-2xl font-bold text-primary-800 mt-1">{statistics.totalCount}</h4>
            </div>
            <div className="bg-primary-50 p-2 rounded-full">
              <ArrowDownUp className="h-5 w-5 text-primary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <p className="truncate">All time transactions</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
              <h4 className="text-2xl font-bold text-primary-800 mt-1">{statistics.totalVolume}</h4>
            </div>
            <div className="bg-green-50 p-2 rounded-full">
              <Receipt className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <p className="truncate">Total amount processed</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <h4 className="text-2xl font-bold text-green-600 mt-1">{statistics.byStatus?.completed || 0}</h4>
            </div>
            <div className="bg-green-50 p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <p className="truncate">Successfully completed transactions</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending/Processing</p>
              <h4 className="text-2xl font-bold text-yellow-600 mt-1">
                {(statistics.byStatus?.pending || 0) + (statistics.byStatus?.processing || 0)}
              </h4>
            </div>
            <div className="bg-yellow-50 p-2 rounded-full">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <p className="truncate">Transactions in progress</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
