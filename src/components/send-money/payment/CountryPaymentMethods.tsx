
import React, { useState, useEffect } from 'react';
import { getPaymentMethodById, getProviderById } from '@/data/cameroonPaymentProviders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCountries } from '@/hooks/useCountries';
import { getProviderOptions } from '@/utils/paymentUtils';

interface CountryPaymentMethodsProps {
  countryCode: string;
  selectedPaymentMethod: string | null;
  selectedProvider: string | undefined;
  onSelect: (methodId: string, providerId: string) => void;
}

const CountryPaymentMethods: React.FC<CountryPaymentMethodsProps> = ({
  countryCode,
  selectedPaymentMethod,
  selectedProvider,
  onSelect
}) => {
  const { getCountryByCode } = useCountries();
  const [activeTab, setActiveTab] = useState<string>('mobile_money');
  const country = getCountryByCode(countryCode);
  
  // Set initial active tab based on available payment methods
  useEffect(() => {
    if (country?.paymentMethods && country.paymentMethods.length > 0) {
      setActiveTab(country.paymentMethods[0].id);
    }
    
    // If there's a selected method, set it as active tab
    if (selectedPaymentMethod) {
      setActiveTab(selectedPaymentMethod);
    }
  }, [country, selectedPaymentMethod]);

  if (!country) return <div>Country not found</div>;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Get the first provider for this payment method
    const providers = getProviderOptions(value, countryCode);
    if (providers && providers.length > 0) {
      onSelect(value, providers[0].id);
    }
  };

  const renderPaymentMethodContent = (methodId: string) => {
    const providers = getProviderOptions(methodId, countryCode);
    
    if (!providers || providers.length === 0) {
      return <p className="text-sm text-muted-foreground py-2">No providers available</p>;
    }
    
    return (
      <RadioGroup 
        value={selectedProvider} 
        onValueChange={(value) => onSelect(methodId, value)}
        className="space-y-3 mt-3"
      >
        {providers.map((provider) => (
          <div key={provider.id} className="flex items-center space-x-3 border p-3 rounded-md">
            <RadioGroupItem value={provider.id} id={provider.id} />
            <div className="flex items-center space-x-3 flex-1">
              {provider.logoUrl && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img 
                    src={provider.logoUrl} 
                    alt={provider.name} 
                    className="h-6 w-6 object-contain" 
                  />
                </div>
              )}
              <Label htmlFor={provider.id} className="font-medium cursor-pointer">
                {provider.name}
              </Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment Methods in {country.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full mb-4">
            {country.paymentMethods.map((method) => (
              <TabsTrigger 
                key={method.id} 
                value={method.id}
                className="flex-1"
              >
                {method.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {country.paymentMethods.map((method) => (
            <TabsContent key={method.id} value={method.id}>
              {renderPaymentMethodContent(method.id)}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CountryPaymentMethods;
