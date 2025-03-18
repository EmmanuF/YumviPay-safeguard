
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CountryTable } from '.';
import { AdminCountry } from '@/services/admin/adminCountryService';

interface AdminCountriesContentProps {
  countries: AdminCountry[];
  isLoading: boolean;
  onToggleSending: (code: string, currentValue: boolean) => Promise<void>;
  onToggleReceiving: (code: string, currentValue: boolean) => Promise<void>;
  onViewDetails: (country: AdminCountry) => void;
  onEditPaymentMethods: (country: AdminCountry) => void;
}

const AdminCountriesContent: React.FC<AdminCountriesContentProps> = ({
  countries,
  isLoading,
  onToggleSending,
  onToggleReceiving,
  onViewDetails,
  onEditPaymentMethods
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Countries</CardTitle>
        <CardDescription>
          Manage supported countries and their payment methods for the Yumvi-Pay platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CountryTable
          countries={countries}
          isLoading={isLoading}
          onToggleSending={onToggleSending}
          onToggleReceiving={onToggleReceiving}
          onViewDetails={onViewDetails}
          onEditPaymentMethods={onEditPaymentMethods}
        />
      </CardContent>
    </Card>
  );
};

export default AdminCountriesContent;
