
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportFormValues } from './GenerateReportForm';

interface SelectorProps {
  control: Control<ReportFormValues>;
}

export const ReportFormatSelector: React.FC<SelectorProps> = ({ control }) => (
  <FormField
    control={control}
    name="format"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Format</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="excel">Excel</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>
          Choose the file format for your report
        </FormDescription>
      </FormItem>
    )}
  />
);

export const TransactionStatusSelector: React.FC<SelectorProps> = ({ control }) => (
  <FormField
    control={control}
    name="transactionStatus"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Transaction Status</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>
          Filter transactions by status
        </FormDescription>
      </FormItem>
    )}
  />
);

export const UserStatusSelector: React.FC<SelectorProps> = ({ control }) => (
  <FormField
    control={control}
    name="userStatus"
    render={({ field }) => (
      <FormItem>
        <FormLabel>User Status</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>
          Filter users by status
        </FormDescription>
      </FormItem>
    )}
  />
);
