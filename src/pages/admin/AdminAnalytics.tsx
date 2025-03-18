
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';

const AdminAnalytics = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-primary-700">Analytics</h1>
        
        <Card className="analytics-card primary-border overflow-visible shadow-md">
          <CardHeader className="bg-gradient-to-br from-primary-50 to-white border-b border-primary-100">
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>
              View detailed analytics about transactions and user activity
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <AnalyticsDashboard />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
