
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useAdminCountries } from '@/hooks/admin/useAdminCountries';
import { 
  AddCountryDialog, 
  CountryDetailsDialog,
  EditPaymentMethodsDialog
} from '@/components/admin/countries';
import { SendingCountriesTab } from '@/components/admin/countries/sending/SendingCountriesTab';
import { ReceivingCountriesTab } from '@/components/admin/countries/receiving/ReceivingCountriesTab';

const CountriesManagement = () => {
  const [activeTab, setActiveTab] = useState<'sending' | 'receiving'>('sending');
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    isPaymentMethodsDialogOpen,
    setIsPaymentMethodsDialogOpen,
    selectedCountry,
    setSelectedCountry,
    handleAddCountry,
    handleUpdatePaymentMethods,
  } = useAdminCountries();

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Countries Management</h1>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Tabs 
              defaultValue="sending" 
              className="w-full"
              onValueChange={(value) => setActiveTab(value as 'sending' | 'receiving')}
            >
              <TabsList variant="underline" className="w-full justify-start border-b rounded-none px-4 pt-2">
                <TabsTrigger value="sending" variant="underline" className="px-8 text-base">
                  Sending Countries
                </TabsTrigger>
                <TabsTrigger value="receiving" variant="underline" className="px-8 text-base">
                  Receiving Countries
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="sending" className="p-4">
                <SendingCountriesTab 
                  onViewDetails={(country) => {
                    setSelectedCountry(country);
                    setIsDetailsDialogOpen(true);
                  }}
                  onEditPaymentMethods={(country) => {
                    setSelectedCountry(country);
                    setIsPaymentMethodsDialogOpen(true);
                  }}
                  onAddCountry={() => setIsAddDialogOpen(true)}
                />
              </TabsContent>
              
              <TabsContent value="receiving" className="p-4">
                <ReceivingCountriesTab 
                  onViewDetails={(country) => {
                    setSelectedCountry(country);
                    setIsDetailsDialogOpen(true);
                  }}
                  onEditPaymentMethods={(country) => {
                    setSelectedCountry(country);
                    setIsPaymentMethodsDialogOpen(true);
                  }}
                  onAddCountry={() => setIsAddDialogOpen(true)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <AddCountryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddCountry}
        type={activeTab}
      />
      
      <CountryDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        country={selectedCountry}
        onEditPaymentMethods={() => {
          setIsDetailsDialogOpen(false);
          setIsPaymentMethodsDialogOpen(true);
        }}
      />
      
      <EditPaymentMethodsDialog
        open={isPaymentMethodsDialogOpen}
        onOpenChange={setIsPaymentMethodsDialogOpen}
        country={selectedCountry}
        onSave={handleUpdatePaymentMethods}
      />
    </AdminLayout>
  );
};

export default CountriesManagement;
