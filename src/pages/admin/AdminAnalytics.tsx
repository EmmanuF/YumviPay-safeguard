
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';

const AdminAnalytics = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6 p-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary-700">Analytics Dashboard</h1>
        
        <Card 
          className="overflow-visible shadow-md"
          gradient="purple"
          hoverEffect={true}
        >
          <CardHeader className="bg-gradient-to-br from-primary-50 to-white border-b border-primary-100">
            <CardTitle className="text-primary-800">Analytics Overview</CardTitle>
            <CardDescription>
              View detailed analytics about transactions, users, and business performance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <AnalyticsDashboard />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
