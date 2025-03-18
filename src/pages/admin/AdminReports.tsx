
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { GenerateReportForm } from '@/components/admin/reports/GenerateReportForm';

const AdminReports = () => {
  const { toast } = useToast();

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
                <GenerateReportForm />
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
