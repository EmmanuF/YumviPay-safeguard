
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AdminCountry } from '@/services/admin/adminCountryService';

interface CountryTableProps {
  countries: AdminCountry[];
  isLoading: boolean;
  onToggleSending: (code: string, currentValue: boolean) => Promise<void>;
  onToggleReceiving: (code: string, currentValue: boolean) => Promise<void>;
}

const CountryTable: React.FC<CountryTableProps> = ({
  countries,
  isLoading,
  onToggleSending,
  onToggleReceiving
}) => {
  const { toast } = useToast();
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (countries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No countries found matching your search criteria
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Flag</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Sending</TableHead>
          <TableHead>Receiving</TableHead>
          <TableHead>Payment Methods</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {countries.map((country) => (
          <TableRow key={country.code}>
            <TableCell className="font-medium">{country.code}</TableCell>
            <TableCell>{country.flag_emoji || '🌐'}</TableCell>
            <TableCell>{country.name}</TableCell>
            <TableCell>
              {country.currency_symbol} {country.currency}
            </TableCell>
            <TableCell>
              <Switch 
                checked={country.is_sending_enabled} 
                onCheckedChange={() => onToggleSending(country.code, country.is_sending_enabled)}
              />
            </TableCell>
            <TableCell>
              <Switch 
                checked={country.is_receiving_enabled} 
                onCheckedChange={() => onToggleReceiving(country.code, country.is_receiving_enabled)}
              />
            </TableCell>
            <TableCell>
              <Badge>
                {country.payment_methods?.length || 0} methods
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                onClick={() => toast({
                  title: "Not Implemented",
                  description: "Country details editing not implemented yet"
                })}
              >
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CountryTable;
