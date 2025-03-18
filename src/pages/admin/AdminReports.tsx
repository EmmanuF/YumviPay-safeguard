
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminReports = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>System Reports</CardTitle>
            <CardDescription>
              Generate and view system reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Reporting interface will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
