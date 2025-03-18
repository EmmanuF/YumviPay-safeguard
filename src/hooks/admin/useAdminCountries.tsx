
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { 
  getAdminCountries, 
  updateCountrySettings,
  updateCountryPaymentMethods,
  addNewCountry,
  AdminCountry 
} from '@/services/admin/adminCountryService';

export const useAdminCountries = () => {
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

  return {
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
  };
};
