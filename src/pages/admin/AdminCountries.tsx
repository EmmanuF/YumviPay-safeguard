
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminCountries } from '@/hooks/admin/useAdminCountries';
import { 
  AddCountryDialog, 
  CountryDetailsDialog,
  EditPaymentMethodsDialog,
  AdminCountriesHeader,
  AdminCountriesContent
} from '@/components/admin/countries';
import { AdminCountry } from '@/services/admin/countries/types';

const AdminCountries = () => {
  const {
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    isPaymentMethodsDialogOpen,
    setIsPaymentMethodsDialogOpen,
    selectedCountry,
    setSelectedCountry,
    isRefreshing,
    isLoading,
    filteredCountries,
    handleToggleSending,
    handleToggleReceiving,
    handleAddCountry,
    handleUpdatePaymentMethods,
    handleRefresh
  } = useAdminCountries();

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <AdminCountriesHeader 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
          onRefresh={handleRefresh}
          onAddCountry={() => setIsAddDialogOpen(true)}
          isRefreshing={isRefreshing}
        />
        
        <AdminCountriesContent 
          countries={filteredCountries}
          isLoading={isLoading}
          onToggleSending={handleToggleSending}
          onToggleReceiving={handleToggleReceiving}
          onViewDetails={(country) => {
            setSelectedCountry(country);
            setIsDetailsDialogOpen(true);
          }}
          onEditPaymentMethods={(country) => {
            setSelectedCountry(country);
            setIsPaymentMethodsDialogOpen(true);
          }}
        />
      </div>
      
      <AddCountryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddCountry}
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

export default AdminCountries;
