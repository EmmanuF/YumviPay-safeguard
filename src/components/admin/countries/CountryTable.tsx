
import React, { useState } from 'react';
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
import { Loader2, ChevronDown, Eye, Edit } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AdminCountry } from '@/services/admin/countries/types';

interface CountryTableProps {
  countries: AdminCountry[];
  isLoading: boolean;
  onToggleSending: (code: string, currentValue: boolean) => Promise<void>;
  onToggleReceiving: (code: string, currentValue: boolean) => Promise<void>;
  onViewDetails: (country: AdminCountry) => void;
  onEditPaymentMethods: (country: AdminCountry) => void;
}

const CountryTable: React.FC<CountryTableProps> = ({
  countries,
  isLoading,
  onToggleSending,
  onToggleReceiving,
  onViewDetails,
  onEditPaymentMethods
}) => {
  const [processingCodes, setProcessingCodes] = useState<{[key: string]: {sending?: boolean, receiving?: boolean}}>({});
  
  const handleToggleSending = async (code: string, currentValue: boolean) => {
    // Set the specific toggle type to processing
    setProcessingCodes(prev => ({
      ...prev,
      [code]: { ...prev[code], sending: true }
    }));

    try {
      await onToggleSending(code, currentValue);
      console.log(`Toggle sending completed for ${code}`);
    } catch (error) {
      console.error(`Error toggling sending for ${code}:`, error);
    } finally {
      // Clear the processing state for this specific toggle
      setProcessingCodes(prev => ({
        ...prev,
        [code]: { ...prev[code], sending: false }
      }));
    }
  };
  
  const handleToggleReceiving = async (code: string, currentValue: boolean) => {
    // Set the specific toggle type to processing
    setProcessingCodes(prev => ({
      ...prev,
      [code]: { ...prev[code], receiving: true }
    }));

    try {
      await onToggleReceiving(code, currentValue);
      console.log(`Toggle receiving completed for ${code}`);
    } catch (error) {
      console.error(`Error toggling receiving for ${code}:`, error);
    } finally {
      // Clear the processing state for this specific toggle
      setProcessingCodes(prev => ({
        ...prev,
        [code]: { ...prev[code], receiving: false }
      }));
    }
  };
  
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
          <TableHead>Country</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Sending</TableHead>
          <TableHead>Receiving</TableHead>
          <TableHead>Payment Methods</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {countries.map((country) => {
          const isSendingProcessing = processingCodes[country.code]?.sending;
          const isReceivingProcessing = processingCodes[country.code]?.receiving;
          
          return (
            <TableRow key={country.code}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{country.flag_emoji || '🌐'}</span>
                  <div>
                    <p className="font-medium">{country.name}</p>
                    <p className="text-xs text-muted-foreground">{country.code}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {country.currency_symbol} {country.currency}
              </TableCell>
              <TableCell>
                {isSendingProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Switch 
                    checked={country.is_sending_enabled} 
                    onCheckedChange={() => handleToggleSending(country.code, country.is_sending_enabled)}
                    disabled={isSendingProcessing || isReceivingProcessing}
                  />
                )}
              </TableCell>
              <TableCell>
                {isReceivingProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Switch 
                    checked={country.is_receiving_enabled} 
                    onCheckedChange={() => handleToggleReceiving(country.code, country.is_receiving_enabled)}
                    disabled={isSendingProcessing || isReceivingProcessing}
                  />
                )}
              </TableCell>
              <TableCell>
                <Badge className="bg-primary-50 text-primary-700 hover:bg-primary-100 border-primary-200">
                  {country.payment_methods?.length || 0} methods
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewDetails(country)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditPaymentMethods(country)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Payment Methods
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default CountryTable;
