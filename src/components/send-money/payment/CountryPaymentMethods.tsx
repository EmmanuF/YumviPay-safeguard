
import React, { useState, useEffect } from 'react';
import { getPaymentMethodById, getProviderById } from '@/data/cameroonPaymentProviders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCountries } from '@/hooks/useCountries';
import { getProviderOptions } from '@/utils/paymentUtils';
import { Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      // For bank_transfer, don't select any provider as it's coming soon
      if (value === 'bank_transfer') {
        onSelect(value, '');
        return;
      }
      onSelect(value, providers[0].id);
    }
  };

  // Check if method is coming soon
  const isMethodComingSoon = (methodId: string) => {
    return methodId === 'bank_transfer';
  };

  // Check if provider is coming soon
  const isProviderComingSoon = (providerId: string) => {
    return providerId === 'yoomee_money' || providerId.includes('afriland') || providerId.includes('ecobank');
  };

  const renderPaymentMethodContent = (methodId: string) => {
    const providers = getProviderOptions(methodId, countryCode);
    
    if (!providers || providers.length === 0) {
      return <p className="text-sm text-muted-foreground py-2">No providers available</p>;
    }
    
    // If the entire method is coming soon
    if (isMethodComingSoon(methodId)) {
      return (
        <div className="p-4 border border-amber-200 rounded-md bg-amber-50 mt-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <p className="text-amber-800 font-medium">Coming Soon</p>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            Bank transfer options are coming soon. Please use Mobile Money for now.
          </p>
        </div>
      );
    }
    
    return (
      <RadioGroup 
        value={selectedProvider} 
        onValueChange={(value) => onSelect(methodId, value)}
        className="space-y-3 mt-3"
      >
        {providers.map((provider) => {
          const comingSoon = isProviderComingSoon(provider.id);
          
          return (
            <div 
              key={provider.id} 
              className={`flex items-center space-x-3 border p-3 rounded-md ${
                comingSoon ? "bg-gray-50 border-gray-200" : ""
              }`}
            >
              {!comingSoon && (
                <RadioGroupItem value={provider.id} id={provider.id} disabled={comingSoon} />
              )}
              <div className="flex items-center space-x-3 flex-1">
                {provider.logoUrl && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      src={provider.logoUrl} 
                      alt={provider.name} 
                      className={`h-6 w-6 object-contain ${comingSoon ? "opacity-50" : ""}`} 
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Label 
                      htmlFor={provider.id} 
                      className={`font-medium cursor-pointer ${comingSoon ? "text-gray-500" : ""}`}
                    >
                      {provider.name}
                    </Label>
                    {comingSoon && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs font-normal">
                        <Clock className="h-3 w-3 mr-1" /> Coming Soon
                      </Badge>
                    )}
                  </div>
                  {comingSoon && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      This payment option will be available soon
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
