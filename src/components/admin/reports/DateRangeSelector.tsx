
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportFormValues } from './GenerateReportForm';

interface DateRangeSelectorProps {
  control: Control<ReportFormValues>;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="dateRange"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date Range</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="thisMonth">This month</SelectItem>
              <SelectItem value="lastMonth">Last month</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Select the time period for your report
          </FormDescription>
        </FormItem>
      )}
    />
  );
};
