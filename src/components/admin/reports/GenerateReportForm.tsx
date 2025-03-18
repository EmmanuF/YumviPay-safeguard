
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { DateRangeSelector } from './DateRangeSelector';
import { useToast } from '@/components/ui/use-toast';

export type ReportFormValues = {
  reportType: string;
  dateRange: string;
  startDate?: Date;
  endDate?: Date;
  format: string;
  transactionStatus?: string;
  userStatus?: string;
}

export const GenerateReportForm = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = React.useState('transactions');
  
  const form = useForm<ReportFormValues>({
    defaultValues: {
      reportType: 'transactions',
      dateRange: 'last30',
      startDate: undefined,
      endDate: undefined,
      format: 'csv',
      transactionStatus: 'all',
      userStatus: 'all'
    }
  });

  const handleGenerateReport = (values: ReportFormValues) => {
    toast({
      title: "Generating Report",
      description: `Your ${values.reportType} report is being generated.`,
    });
    
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your report has been generated and is ready for download.",
      });
    }, 2000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleGenerateReport)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="reportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Type</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setReportType(value);
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="transactions">Transactions Report</SelectItem>
                    <SelectItem value="users">Users Report</SelectItem>
                    <SelectItem value="countries">Countries Report</SelectItem>
                    <SelectItem value="financials">Financial Report</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the type of data to include in your report
                </FormDescription>
              </FormItem>
            )}
          />

          <DateRangeSelector control={form.control} />
        </div>

        {form.watch('dateRange') === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomDateFields control={form.control} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReportFormatSelector control={form.control} />
          {reportType === 'transactions' && (
            <TransactionStatusSelector control={form.control} />
          )}
          {reportType === 'users' && (
            <UserStatusSelector control={form.control} />
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="min-w-[150px]">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </form>
    </Form>
  );
};
