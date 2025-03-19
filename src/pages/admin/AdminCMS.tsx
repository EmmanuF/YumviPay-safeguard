
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Text, 
  Image, 
  PaintBucket, 
  Layers, 
  File, 
  DollarSign, 
  Globe, 
  Tag, 
  Gift, 
  Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Import the CMS component sections
import AppearanceEditor from '@/components/admin/cms/AppearanceEditor';
import ContentEditor from '@/components/admin/cms/ContentEditor';
import PagesManager from '@/components/admin/cms/PagesManager';
import RatesManager from '@/components/admin/cms/RatesManager';
import CountriesManager from '@/components/admin/cms/CountriesManager';
import FeesManager from '@/components/admin/cms/FeesManager';
import PromotionsManager from '@/components/admin/cms/PromotionsManager';
import ReferralsManager from '@/components/admin/cms/ReferralsManager';

const AdminCMS = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('content');
  
  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your CMS changes have been saved successfully",
    });
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary-800">Content Management</h1>
            <p className="text-muted-foreground">Manage website content, appearance, and system settings</p>
          </div>
          
          <Button onClick={handleSaveChanges} className="bg-primary-600 hover:bg-primary-700">
            Save All Changes
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1 p-1 rounded-lg bg-gradient-to-r from-primary-50/90 to-secondary-50/90 shadow-md backdrop-blur-sm">
            <TabsTrigger 
              value="content" 
              className="flex flex-col items-center gap-1 p-3 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <Text className="h-4 w-4" />
              <span className="text-xs">Content</span>
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="flex flex-col items-center gap-1 p-3 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <PaintBucket className="h-4 w-4" />
              <span className="text-xs">Appearance</span>
            </TabsTrigger>
            <TabsTrigger 
              value="pages" 
              className="flex flex-col items-center gap-1 p-3 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <File className="h-4 w-4" />
              <span className="text-xs">Pages</span>
            </TabsTrigger>
            <TabsTrigger 
              value="rates" 
              className="flex flex-col items-center gap-1 p-3 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Rates</span>
            </TabsTrigger>
            <TabsTrigger 
              value="countries" 
              className="flex flex-col items-center gap-1 p-3 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs">Countries</span>
            </TabsTrigger>
            <TabsTrigger 
              value="fees" 
              className="flex flex-col items-center gap-1 p-3 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <Tag className="h-4 w-4" />
              <span className="text-xs">Fees</span>
            </TabsTrigger>
            <TabsTrigger 
              value="promotions" 
              className="flex flex-col items-center gap-1 p-3 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <Gift className="h-4 w-4" />
              <span className="text-xs">Promotions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="referrals" 
              className="flex flex-col items-center gap-1 p-3 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
              <span className="text-xs">Referrals</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="animate-slide-up">
            <ContentEditor />
          </TabsContent>
          
          <TabsContent value="appearance" className="animate-slide-up">
            <AppearanceEditor />
          </TabsContent>
          
          <TabsContent value="pages" className="animate-slide-up">
            <PagesManager />
          </TabsContent>
          
          <TabsContent value="rates" className="animate-slide-up">
            <RatesManager />
          </TabsContent>
          
          <TabsContent value="countries" className="animate-slide-up">
            <CountriesManager />
          </TabsContent>
          
          <TabsContent value="fees" className="animate-slide-up">
            <FeesManager />
          </TabsContent>
          
          <TabsContent value="promotions" className="animate-slide-up">
            <PromotionsManager />
          </TabsContent>
          
          <TabsContent value="referrals" className="animate-slide-up">
            <ReferralsManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminCMS;
