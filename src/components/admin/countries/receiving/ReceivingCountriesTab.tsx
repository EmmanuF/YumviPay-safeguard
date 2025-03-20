
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { AdminCountry } from '@/services/admin/countries/types';
import { getAdminCountries, updateCountrySettings } from '@/services/admin/countries';
import { CountryTableRow } from '../receiving/CountryTableRow';

// Define African country codes
const AFRICAN_COUNTRY_CODES = [
  'CM', 'GH', 'NG', 'SN', 'CI', 'BJ', 'TG', 'BF', 'ML', 'NE', 'GW', 'GN', 
  'SL', 'LR', 'CD', 'GA', 'TD', 'CF', 'CG', 'GQ', 'KE', 'TZ', 'UG', 'RW',
  'BI', 'ET', 'SO', 'ZA', 'NA', 'BW', 'ZW', 'MZ', 'ZM', 'AO', 'MA', 'DZ',
  'TN', 'LY', 'EG', 'SD', 'SS'
];

interface ReceivingCountriesTabProps {
  onViewDetails: (country: AdminCountry) => void;
  onEditPaymentMethods: (country: AdminCountry) => void;
  onAddCountry: () => void;
}

export const ReceivingCountriesTab: React.FC<ReceivingCountriesTabProps> = ({
  onViewDetails,
  onEditPaymentMethods,
  onAddCountry
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const { 
    data: allCountries = [], 
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['adminCountries'],
    queryFn: getAdminCountries,
    refetchOnWindowFocus: false,
  });

  // Filter to only include African countries
  const receivingCountries = allCountries.filter(country => 
    AFRICAN_COUNTRY_CODES.includes(country.code)
  );
  
  // Apply search filter
  const filteredCountries = receivingCountries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleReceiving = async (code: string, currentValue: boolean) => {
    try {
      const success = await updateCountrySettings(code, {
        is_receiving_enabled: !currentValue
      });
      
      if (success) {
        await refetch();
        toast({
          title: "Setting Updated",
          description: `Receiving ${!currentValue ? 'enabled' : 'disabled'} for ${code}`,
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update country settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error toggling receiving for ${code}:`, error);
      toast({
        title: "Error",
        description: "An error occurred while updating country settings",
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search receiving countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <span className="sr-only">Clear</span>
              <span className="text-gray-400">×</span>
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={onAddCountry}>
            <Plus className="mr-2 h-4 w-4" />
            Add Country
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCountries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'No countries match your search' : 'No receiving countries found'}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Methods</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCountries.map((country) => (
              <CountryTableRow 
                key={country.code}
                country={country}
                onToggleEnabled={handleToggleReceiving}
                onViewDetails={() => onViewDetails(country)}
                onEditPaymentMethods={() => onEditPaymentMethods(country)}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
