
import React, { useState, Suspense, lazy, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useAdminCountries } from '@/hooks/admin/useAdminCountries';
import { 
  AddCountryDialog, 
  CountryDetailsDialog,
  EditPaymentMethodsDialog
} from '@/components/admin/countries';
import { Loader2 } from 'lucide-react';
import { checkAndInitializeSendingCountries } from '@/services/admin/countries/utils';
import { addNewCountry } from '@/services/admin/countries';

// Lazy load the tab content components for better performance
const SendingCountriesTab = lazy(() => 
  import('@/components/admin/countries/sending/SendingCountriesTab')
    .then(module => ({ default: module.SendingCountriesTab }))
);

const ReceivingCountriesTab = lazy(() => 
  import('@/components/admin/countries/receiving/ReceivingCountriesTab')
    .then(module => ({ default: module.ReceivingCountriesTab }))
);

// Loading component for tabs
const TabLoadingIndicator = () => (
  <div className="flex justify-center items-center min-h-[300px]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="ml-2 text-lg font-medium">Loading countries data...</p>
  </div>
);

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
    filteredCountries,
    isLoading,
    refetch
  } = useAdminCountries();

  // Initialize countries if needed
  useEffect(() => {
    const initializeCountries = async () => {
      if (!isLoading && filteredCountries.length > 0) {
        try {
          await checkAndInitializeSendingCountries(filteredCountries, addNewCountry);
          // After initialization, refetch the data
          refetch();
        } catch (error) {
          console.error('Error initializing countries:', error);
        }
      }
    };
    
    initializeCountries();
  }, [isLoading, filteredCountries, refetch]);

  // Log render for performance tracking
  console.log('CountriesManagement component rendering');

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
                <Suspense fallback={<TabLoadingIndicator />}>
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
                </Suspense>
              </TabsContent>
              
              <TabsContent value="receiving" className="p-4">
                <Suspense fallback={<TabLoadingIndicator />}>
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
                </Suspense>
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
