
import React from 'react';
import CountryPaymentMethods from './CountryPaymentMethods';
import { PaymentMethod } from '@/types/country';

interface AvailableMethodsSectionProps {
  countryCode: string;
  methods: PaymentMethod[];
  isLoading: boolean;
  selectedMethod: string | null;
  selectedProvider: string | undefined;
  onSelectMethod: (methodId: string, providerId: string) => void;
  getMethodIcon: (methodId: string) => React.ReactNode;
}

const AvailableMethodsSection: React.FC<AvailableMethodsSectionProps> = ({
  countryCode,
  methods,
  isLoading,
  selectedMethod,
  selectedProvider,
  onSelectMethod,
  getMethodIcon
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Available payment methods</h3>
      <CountryPaymentMethods
        countryCode={countryCode}
        methods={methods}
        isLoading={isLoading}
        selectedMethod={selectedMethod}
        selectedProvider={selectedProvider}
        onSelectMethod={onSelectMethod}
        getMethodIcon={getMethodIcon}
      />
    </div>
  );
};

export default AvailableMethodsSection;
