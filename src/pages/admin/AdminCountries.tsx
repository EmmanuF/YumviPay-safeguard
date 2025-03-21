
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
          countries={filteredCountries as any[]} // Type cast to resolve incompatibility
          isLoading={isLoading}
          onToggleSending={handleToggleSending}
          onToggleReceiving={handleToggleReceiving}
          onViewDetails={(country) => {
            setSelectedCountry(country as AdminCountry); // Type cast for compatibility
            setIsDetailsDialogOpen(true);
          }}
          onEditPaymentMethods={(country) => {
            setSelectedCountry(country as AdminCountry); // Type cast for compatibility
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
        country={selectedCountry as any} // Type cast to resolve incompatibility
        onEditPaymentMethods={() => {
          setIsDetailsDialogOpen(false);
          setIsPaymentMethodsDialogOpen(true);
        }}
      />
      
      <EditPaymentMethodsDialog
        open={isPaymentMethodsDialogOpen}
        onOpenChange={setIsPaymentMethodsDialogOpen}
        country={selectedCountry as any} // Type cast to resolve incompatibility
        onSave={handleUpdatePaymentMethods}
      />
    </AdminLayout>
  );
};

export default AdminCountries;
