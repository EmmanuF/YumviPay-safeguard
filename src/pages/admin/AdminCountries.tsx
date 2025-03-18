
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
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getAdminCountries, 
  updateCountrySettings, 
  addNewCountry,
  AdminCountry
} from '@/services/admin/adminCountryService';
import { 
  CountryTable, 
  AddCountryDialog, 
  CountrySearch 
} from '@/components/admin/countries';

const AdminCountries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
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
      const newCountry = {
        ...data,
        is_sending_enabled: false,
        is_receiving_enabled: false,
        payment_methods: []
      } as AdminCountry;
      
      const success = await addNewCountry(newCountry);
      
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
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Countries Management</h1>
          <div className="flex space-x-2">
            <CountrySearch 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
            />
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Country
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Countries</CardTitle>
            <CardDescription>
              Manage supported countries and their payment methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CountryTable
              countries={filteredCountries}
              isLoading={isLoading}
              onToggleSending={handleToggleSending}
              onToggleReceiving={handleToggleReceiving}
            />
          </CardContent>
        </Card>
      </div>
      
      <AddCountryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddCountry}
      />
    </AdminLayout>
  );
};

export default AdminCountries;
