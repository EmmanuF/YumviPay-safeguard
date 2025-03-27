
import React, { useState, useEffect } from 'react';
import { getPaymentMethodById } from '@/data/cameroonPaymentProviders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCountries } from '@/hooks/useCountries';
import { getProviderOptions } from '@/utils/paymentUtils';
import { useToast } from '@/components/ui/use-toast';
import ProviderList from './ProviderList';
import ComingSoonMessage from './ComingSoonMessage';

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
  const { toast } = useToast();
  
  console.log("DEBUG - CountryPaymentMethods - countryCode:", countryCode);
  console.log("DEBUG - CountryPaymentMethods - selectedPaymentMethod:", selectedPaymentMethod);
  console.log("DEBUG - CountryPaymentMethods - selectedProvider:", selectedProvider);
  console.log("DEBUG - CountryPaymentMethods - country found:", country);
  
  if (country?.paymentMethods) {
    console.log("DEBUG - Payment methods from country:", country.paymentMethods);
    country.paymentMethods.forEach(method => {
      console.log(`DEBUG - Payment method: ${method.name}, ID: "${method.id}"`);
    });
  }
  
  useEffect(() => {
    if (country?.paymentMethods && country.paymentMethods.length > 0) {
      const firstMethodId = country.paymentMethods[0].id;
      console.log(`DEBUG - Setting initial active tab to: "${firstMethodId}"`);
      setActiveTab(firstMethodId);
    }
    
    if (selectedPaymentMethod) {
      console.log(`DEBUG - Using selected method as active tab: "${selectedPaymentMethod}"`);
      setActiveTab(selectedPaymentMethod);
    }
  }, [country, selectedPaymentMethod]);

  if (!country) {
    console.error("DEBUG - Country not found for code:", countryCode);
    return <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">Country data not found</div>;
  }
  
  if (!country.paymentMethods || country.paymentMethods.length === 0) {
    console.error("DEBUG - No payment methods available for country:", countryCode);
    return <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">No payment methods available for this country</div>;
  }

  const handleTabChange = (value: string) => {
    console.log("DEBUG - Tab changed to:", value);
    setActiveTab(value);
    
    const providers = getProviderOptions(value, countryCode);
    console.log("DEBUG - Available providers for method:", providers);
    
    if (providers && providers.length > 0) {
      if (value === 'bank_transfer') {
        console.log("DEBUG - Bank transfer selected, not selecting provider");
        onSelect(value, '');
        return;
      }
      console.log(`DEBUG - Selecting provider: ${providers[0].id} for method: ${value}`);
      onSelect(value, providers[0].id);
    } else {
      console.error("DEBUG - No providers found for payment method:", value);
      toast({
        title: "Provider Error",
        description: "No payment providers available for this method. Please try another option.",
        variant: "destructive"
      });
    }
  };

  const isMethodComingSoon = (methodId: string) => {
    return methodId === 'bank_transfer';
  };

  const renderPaymentMethodContent = (methodId: string) => {
    const providers = getProviderOptions(methodId, countryCode);
    console.log(`Providers for ${methodId}:`, providers);
    
    if (!providers || providers.length === 0) {
      return <p className="text-sm text-muted-foreground py-2">No providers available</p>;
    }
    
    if (isMethodComingSoon(methodId)) {
      return (
        <ComingSoonMessage message="Bank transfer options are coming soon. Please use Mobile Money for now." />
      );
    }
    
    return (
      <ProviderList 
        providers={providers} 
        selectedProvider={selectedProvider} 
        methodId={methodId}
        onSelectProvider={(providerId) => onSelect(methodId, providerId)}
      />
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
                {isMethodComingSoon(method.id) && (
                  <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
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
