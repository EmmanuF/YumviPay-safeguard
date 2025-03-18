
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Shield, Key, Lock, UserCheck, FileKey } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecurityOverview from '@/components/admin/security/SecurityOverview';
import AccessControl from '@/components/admin/security/AccessControl';
import AuthSettings from '@/components/admin/security/AuthSettings';
import Encryption from '@/components/admin/security/Encryption';
import ComplianceSettings from '@/components/admin/security/ComplianceSettings';

const AdminSecurity = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary-800">Security Settings</h1>
        </div>

        <Card className="border-primary-100/20 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-5 w-full gap-1 p-1 bg-gradient-to-r from-primary-50/90 to-secondary-50/90 shadow-md backdrop-blur-sm">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 hover:bg-white/20"
              >
                <Shield className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              
              <TabsTrigger 
                value="access" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 hover:bg-white/20"
              >
                <Key className="w-4 h-4 mr-2" />
                Access
              </TabsTrigger>
              
              <TabsTrigger 
                value="auth" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 hover:bg-white/20"
              >
                <Lock className="w-4 h-4 mr-2" />
                Authentication
              </TabsTrigger>
              
              <TabsTrigger 
                value="encryption" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 hover:bg-white/20"
              >
                <FileKey className="w-4 h-4 mr-2" />
                Encryption
              </TabsTrigger>
              
              <TabsTrigger 
                value="compliance" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 hover:bg-white/20"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Compliance
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="overview" className="animate-slide-up">
                <SecurityOverview />
              </TabsContent>
              
              <TabsContent value="access" className="animate-slide-up">
                <AccessControl />
              </TabsContent>
              
              <TabsContent value="auth" className="animate-slide-up">
                <AuthSettings />
              </TabsContent>
              
              <TabsContent value="encryption" className="animate-slide-up">
                <Encryption />
              </TabsContent>
              
              <TabsContent value="compliance" className="animate-slide-up">
                <ComplianceSettings />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;
