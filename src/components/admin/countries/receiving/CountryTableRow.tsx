
import React, { useState } from 'react';
import { 
  TableRow,
  TableCell 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface CountryTableRowProps {
  country: AdminCountry;
  onToggleEnabled: (code: string, currentValue: boolean) => Promise<void>;
  onViewDetails: () => void;
  onEditPaymentMethods: () => void;
}

export const CountryTableRow: React.FC<CountryTableRowProps> = ({
  country,
  onToggleEnabled,
  onViewDetails,
  onEditPaymentMethods
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleToggleEnabled = async () => {
    setIsProcessing(true);
    try {
      await onToggleEnabled(country.code, country.is_receiving_enabled);
    } finally {
      setIsProcessing(false);
    }
  };
  
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
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <Switch 
              checked={country.is_receiving_enabled} 
              onCheckedChange={handleToggleEnabled}
              disabled={isProcessing}
            />
            <span className="text-sm">
              {country.is_receiving_enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
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
            <DropdownMenuItem onClick={onViewDetails}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEditPaymentMethods}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Payment Methods
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
