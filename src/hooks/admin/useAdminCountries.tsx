
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { 
  AdminCountry,
  getAdminCountries, 
  updateCountrySettings,
  updateCountryPaymentMethods,
  addNewCountry
} from '@/services/admin/countries';

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
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['adminCountries'],
    queryFn: getAdminCountries,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSending = async (code: string, currentValue: boolean) => {
    console.log(`Toggling sending for ${code} from ${currentValue} to ${!currentValue}`);
    try {
      const newValue = !currentValue;
      const success = await updateCountrySettings(code, {
        is_sending_enabled: newValue
      });
      
      if (success) {
        await refetch(); // Immediately refetch to update the UI
        toast({
          title: "Setting Updated",
          description: `Sending ${newValue ? 'enabled' : 'disabled'} for ${code}`,
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update country settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error in handleToggleSending for ${code}:`, error);
      toast({
        title: "Error",
        description: "An error occurred while updating country settings",
        variant: "destructive",
      });
    }
  };

  const handleToggleReceiving = async (code: string, currentValue: boolean) => {
    console.log(`Toggling receiving for ${code} from ${currentValue} to ${!currentValue}`);
    try {
      const newValue = !currentValue;
      const success = await updateCountrySettings(code, {
        is_receiving_enabled: newValue
      });
      
      if (success) {
        await refetch(); // Immediately refetch to update the UI
        toast({
          title: "Setting Updated",
          description: `Receiving ${newValue ? 'enabled' : 'disabled'} for ${code}`,
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update country settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error in handleToggleReceiving for ${code}:`, error);
      toast({
        title: "Error",
        description: "An error occurred while updating country settings",
        variant: "destructive",
      });
    }
  };

  const handleAddCountry = async (data: Partial<AdminCountry>) => {
    try {
      console.log('Adding country with data:', data);
      
      // Make sure all required fields are present
      if (!data.code || !data.name || !data.currency || !data.currency_symbol) {
        toast({
          title: "Missing Required Fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      
      // Ensure payment_methods is set as an empty array if not provided
      const countryData = {
        ...data,
        payment_methods: data.payment_methods || []
      };
      
      const success = await addNewCountry(countryData);
      
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
      console.error('Error in handleAddCountry:', error);
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
        setIsPaymentMethodsDialogOpen(false);
        refetch();
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update payment methods",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleUpdatePaymentMethods:', error);
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
      console.error('Error in handleRefresh:', error);
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
    isRefreshing: isRefreshing || isRefetching,
    isLoading,
    filteredCountries,
    handleToggleSending,
    handleToggleReceiving,
    handleAddCountry,
    handleUpdatePaymentMethods,
    handleRefresh
  };
};
