
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { 
  TransactionsTab, 
  VolumeTab, 
  TrendsTab,
  ChartTabs
} from './charts';

// Transaction summary type
export interface TransactionSummary {
  name: string;
  transactions: number;
  amount: number;
}

interface TransactionChartsProps {
  transactionData: TransactionSummary[];
}

const TransactionCharts: React.FC<TransactionChartsProps> = ({ transactionData }) => {
  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <Tabs defaultValue="transactions" className="space-y-8">
        <ChartTabs defaultValue="transactions" />
        
        <TabsContent value="transactions">
          <TransactionsTab transactionData={transactionData} />
        </TabsContent>
        
        <TabsContent value="volume">
          <VolumeTab transactionData={transactionData} />
        </TabsContent>
        
        <TabsContent value="trends">
          <TrendsTab transactionData={transactionData} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TransactionCharts;
