
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Settings, Mail, Bell, Palette, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';
import AppearanceSettings from '@/components/admin/settings/AppearanceSettings';
import NotificationSettings from '@/components/admin/settings/NotificationSettings';
import AdvancedSettings from '@/components/admin/settings/AdvancedSettings';

const AdminSettings = () => {
  const { toast } = useToast();
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => toast({
              title: "Settings Reset",
              description: "All settings have been reset to default values.",
            })}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full gap-1 p-1 rounded-lg bg-gradient-to-r from-primary-50/90 to-secondary-50/90 shadow-md backdrop-blur-sm">
            <TabsTrigger 
              value="general" 
              className="transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 animate-slide-up">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 animate-slide-up">
            <AppearanceSettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 animate-slide-up">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 animate-slide-up">
            <AdvancedSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
