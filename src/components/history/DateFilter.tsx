
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface DateFilterProps {
  dateFilter: string;
  setDateFilter: (date: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ 
  dateFilter, 
  setDateFilter 
}) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Date</h4>
      <RadioGroup value={dateFilter} onValueChange={setDateFilter}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="date-all" />
          <Label htmlFor="date-all">All time</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="today" id="date-today" />
          <Label htmlFor="date-today">Today</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="week" id="date-week" />
          <Label htmlFor="date-week">Last 7 days</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="month" id="date-month" />
          <Label htmlFor="date-month">Last 30 days</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default DateFilter;
