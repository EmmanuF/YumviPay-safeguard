
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getAdminCountries, 
  updateCountrySettings,
  updateCountryPaymentMethods,
  addNewCountry,
  AdminCountry
} from '@/services/admin/adminCountryService';
import { 
  CountryTable, 
  AddCountryDialog, 
  CountrySearch,
  CountryDetailsDialog,
  EditPaymentMethodsDialog
} from '@/components/admin/countries';

const AdminCountries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPaymentMethodsDialogOpen, setIsPaymentMethodsDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<AdminCountry | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const { 
    data: countries = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['adminCountries'],
    queryFn: getAdminCountries,
  });
  
  // Filter countries based on search term
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleToggleSending = async (code: string, currentValue: boolean) => {
    try {
      const success = await updateCountrySettings(code, {
        is_sending_enabled: !currentValue
      });
      
      if (success) {
        toast({
          title: "Setting Updated",
          description: `Sending ${!currentValue ? 'enabled' : 'disabled'} for ${code}`,
        });
        
        refetch();
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update country settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating country settings",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleReceiving = async (code: string, currentValue: boolean) => {
    try {
      const success = await updateCountrySettings(code, {
        is_receiving_enabled: !currentValue
      });
      
      if (success) {
        toast({
          title: "Setting Updated",
          description: `Receiving ${!currentValue ? 'enabled' : 'disabled'} for ${code}`,
        });
        
        refetch();
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update country settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating country settings",
        variant: "destructive",
      });
    }
  };
  
  const handleAddCountry = async (data: Partial<AdminCountry>) => {
    try {
      const success = await addNewCountry(data);
      
      if (success) {
        toast({
          title: "Country Added",
          description: `${data.name} has been added successfully`,
        });
        
        setIsAddDialogOpen(false);
        refetch();
      } else {
        toast({
          title: "Failed to Add Country",
          description: "There was an error adding the country",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the country",
        variant: "destructive",
      });
    }
  };
  
  const handleViewDetails = (country: AdminCountry) => {
    setSelectedCountry(country);
    setIsDetailsDialogOpen(true);
  };
  
  const handleEditPaymentMethods = (country: AdminCountry) => {
    setSelectedCountry(country);
    setIsPaymentMethodsDialogOpen(true);
  };
  
  const handleUpdatePaymentMethods = async (code: string, methods: any[]) => {
    try {
      const success = await updateCountryPaymentMethods(code, methods);
      
      if (success) {
        toast({
          title: "Payment Methods Updated",
          description: `Payment methods for ${code} have been updated successfully`,
        });
        
        refetch();
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update payment methods",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating payment methods",
        variant: "destructive",
      });
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Data Refreshed",
        description: "Country list has been updated",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing the data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearSearch = () => setSearchTerm('');
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Countries Management</h1>
          <div className="flex flex-wrap gap-2">
            <CountrySearch 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm}
              onClearSearch={clearSearch}
            />
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Country
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Countries</CardTitle>
            <CardDescription>
              Manage supported countries and their payment methods for the Yumvi-Pay platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CountryTable
              countries={filteredCountries}
              isLoading={isLoading}
              onToggleSending={handleToggleSending}
              onToggleReceiving={handleToggleReceiving}
              onViewDetails={handleViewDetails}
              onEditPaymentMethods={handleEditPaymentMethods}
            />
          </CardContent>
        </Card>
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
        onSave={(code, methods) => handleUpdatePaymentMethods(code, methods)}
      />
    </AdminLayout>
  );
};

export default AdminCountries;
