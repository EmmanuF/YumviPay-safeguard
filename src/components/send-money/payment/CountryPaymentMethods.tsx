import React, { useState, useEffect } from 'react';
import { getPaymentMethodById, getProviderById } from '@/data/cameroonPaymentProviders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCountries } from '@/hooks/useCountries';
import { getProviderOptions } from '@/utils/paymentUtils';
import { Clock, AlertCircle, CreditCard, Smartphone, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PaymentMethodCard from '@/components/payment-method/PaymentMethodCard';
import { useToast } from '@/components/ui/use-toast';

interface CountryPaymentMethodsProps {
  countryCode: string;
  methods: PaymentMethod[];
  isLoading: boolean;
  selectedMethod: string | null;
  selectedProvider: string | undefined;
  onSelectMethod: (methodId: string, providerId: string) => void;
  getMethodIcon?: (methodId: string) => React.ReactNode;
}

const CountryPaymentMethods: React.FC<CountryPaymentMethodsProps> = ({
  countryCode,
  methods,
  isLoading,
  selectedMethod,
  selectedProvider,
  onSelectMethod,
  getMethodIcon
}) => {
  const { getCountryByCode } = useCountries();
  const [activeTab, setActiveTab] = useState<string>('mobile_money');
  const country = getCountryByCode(countryCode);
  const { toast } = useToast();
  
  console.log("DEBUG - CountryPaymentMethods - countryCode:", countryCode);
  console.log("DEBUG - CountryPaymentMethods - selectedMethod:", selectedMethod);
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
    
    if (selectedMethod) {
      console.log(`DEBUG - Using selected method as active tab: "${selectedMethod}"`);
      setActiveTab(selectedMethod);
    }
  }, [country, selectedMethod]);

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
        onSelectMethod(value, '');
        return;
      }
      console.log(`DEBUG - Selecting provider: ${providers[0].id} for method: ${value}`);
      onSelectMethod(value, providers[0].id);
    } else {
      console.error("DEBUG - No providers found for payment method:", value);
      toast({
        title: "Provider Error",
        description: "No payment providers available for this method. Please try another option.",
        variant: "destructive"
      });
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'smartphone':
        return <Smartphone className="h-6 w-6 text-primary-500" />;
      case 'credit-card':
        return <CreditCard className="h-6 w-6 text-primary-500" />;
      case 'bank':
        return <Building className="h-6 w-6 text-primary-500" />;
      default:
        return <Smartphone className="h-6 w-6 text-primary-500" />;
    }
  };

  const isMethodComingSoon = (methodId: string) => {
    return methodId === 'bank_transfer';
  };

  const isProviderComingSoon = (providerId: string) => {
    return providerId === 'yoomee_money' || providerId.includes('afriland') || providerId.includes('ecobank');
  };

  const renderPaymentMethodContent = (methodId: string) => {
    const providers = getProviderOptions(methodId, countryCode);
    console.log(`Providers for ${methodId}:`, providers);
    
    if (!providers || providers.length === 0) {
      return <p className="text-sm text-muted-foreground py-2">No providers available</p>;
    }
    
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
        onValueChange={(value) => onSelectMethod(methodId, value)}
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
                      onError={(e) => {
                        console.error(`Failed to load image for provider: ${provider.name}`);
                        e.currentTarget.src = 'https://via.placeholder.com/24';
                      }}
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
