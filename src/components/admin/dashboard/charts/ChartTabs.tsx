
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChartTabsProps {
  defaultValue: string;
}

const ChartTabs: React.FC<ChartTabsProps> = ({ defaultValue }) => {
  return (
    <TabsList 
      variant="pills" 
      className="w-full grid grid-cols-3 gap-4 mb-8 bg-gray-50 p-2 rounded-lg overflow-visible shadow-sm"
    >
      <TabsTrigger 
        variant="pills" 
        value="transactions" 
        className="py-3 px-4 font-medium text-sm transition-all duration-200 hover:bg-primary-100/50 rounded-md overflow-hidden"
      >
        Transactions
      </TabsTrigger>
      <TabsTrigger 
        variant="pills" 
        value="volume" 
        className="py-3 px-4 font-medium text-sm transition-all duration-200 hover:bg-emerald-100/50 rounded-md overflow-hidden"
      >
        Volume
      </TabsTrigger>
      <TabsTrigger 
        variant="pills" 
        value="trends" 
        className="py-3 px-4 font-medium text-sm transition-all duration-200 hover:bg-blue-100/50 rounded-md overflow-hidden"
      >
        Trends
      </TabsTrigger>
    </TabsList>
  );
};

export default ChartTabs;
