import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { useForm } from 'react-hook-form';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar as CalendarIcon,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

type ReportFormValues = {
  reportType: string;
  dateRange: string;
  startDate?: Date;
  endDate?: Date;
  format: string;
  transactionStatus?: string;
  userStatus?: string;
}

const AdminReports = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('transactions');
  
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
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <div className="flex space-x-2">
            <Button onClick={() => toast({
              title: "Schedule Report",
              description: "Reports scheduling functionality will be available soon."
            })}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Reports
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="generate" className="w-full space-y-6">
          <TabsList className="w-full grid grid-cols-3 gap-2 bg-gradient-to-r from-primary-50/80 to-secondary-50/80 p-2 rounded-lg">
            <TabsTrigger 
              value="generate" 
              className="w-full text-base font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/50"
            >
              Generate Report
            </TabsTrigger>
            <TabsTrigger 
              value="saved"
              className="w-full text-base font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/50"
            >
              Saved Reports
            </TabsTrigger>
            <TabsTrigger 
              value="scheduled"
              className="w-full text-base font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/50"
            >
              Scheduled Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent 
            value="generate" 
            className="space-y-4 animate-fade-in"
          >
            <Card className="transition-all duration-300 hover:shadow-lg border-l-4 border-primary-500 bg-gradient-to-br from-white to-primary-50/10">
              <CardHeader>
                <CardTitle>Generate New Report</CardTitle>
                <CardDescription>
                  Create custom reports for transactions, users, and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleGenerateReport)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="reportType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Report Type</FormLabel>
                            <Select onValueChange={(value) => {
                              field.onChange(value);
                              setReportType(value);
                            }} defaultValue={field.value}>
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
                      
                      <FormField
                        control={form.control}
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
                    </div>
                    
                    {form.watch('dateRange') === 'custom' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
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
                      
                      {reportType === 'transactions' && (
                        <FormField
                          control={form.control}
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
                      )}
                      
                      {reportType === 'users' && (
                        <FormField
                          control={form.control}
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent 
            value="saved" 
            className="space-y-4 animate-fade-in"
          >
            <Card className="transition-all duration-300 hover:shadow-lg border-l-4 border-secondary-500 bg-gradient-to-br from-white to-secondary-50/10">
              <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
                <CardDescription>
                  Access your previously generated reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Input 
                      className="max-w-sm" 
                      placeholder="Search reports..." 
                    />
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No saved reports found. Generate a report to see it here.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent 
            value="scheduled" 
            className="space-y-4 animate-fade-in"
          >
            <Card className="transition-all duration-300 hover:shadow-lg border-l-4 border-blue-500 bg-gradient-to-br from-white to-blue-50/10">
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>
                  View and manage your scheduled recurring reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No scheduled reports found. Schedule a report to see it here.
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full sm:w-auto" onClick={() => toast({
                  title: "Coming Soon",
                  description: "Report scheduling will be available in the next update.",
                })}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Schedule New Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
