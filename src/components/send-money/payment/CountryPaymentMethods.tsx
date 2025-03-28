
import React, { useState, useEffect } from 'react';
import { getPaymentMethodById } from '@/data/cameroonPaymentProviders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCountries } from '@/hooks/useCountries';
import { getProviderOptions } from '@/utils/paymentUtils';
import { useToast } from '@/components/ui/use-toast';
import ProviderList from './ProviderList';
import ComingSoonMessage from './ComingSoonMessage';
import { Smartphone, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  
  useEffect(() => {
    if (country?.paymentMethods && country.paymentMethods.length > 0) {
      const firstMethodId = country.paymentMethods[0].id;
      setActiveTab(firstMethodId);
    }
    
    if (selectedPaymentMethod) {
      setActiveTab(selectedPaymentMethod);
    }
  }, [country, selectedPaymentMethod]);

  if (!country) {
    return <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">Country data not found</div>;
  }
  
  if (!country.paymentMethods || country.paymentMethods.length === 0) {
    return <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">No payment methods available for this country</div>;
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const providers = getProviderOptions(value, countryCode);
    
    if (providers && providers.length > 0) {
      if (value === 'bank_transfer') {
        onSelect(value, '');
        return;
      }
      onSelect(value, providers[0].id);
    } else {
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

  // Get method icon
  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'mobile_money':
        return <Smartphone className="h-4 w-4 mr-2" />;
      case 'bank_transfer':
        return <Building className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const renderPaymentMethodContent = (methodId: string) => {
    const providers = getProviderOptions(methodId, countryCode);
    
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
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Payment Methods in {country.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full mb-6 bg-gray-100/80 p-1 rounded-lg">
            {country.paymentMethods.map((method) => (
              <TabsTrigger 
                key={method.id} 
                value={method.id}
                className={cn(
                  "flex-1 py-2.5 relative transition-all",
                  "data-[state=active]:bg-white data-[state=active]:shadow-md",
                  "data-[state=active]:border-primary data-[state=active]:border-b-2",
                  "rounded-md data-[state=active]:rounded-md"
                )}
                style={{
                  transform: activeTab === method.id ? 'translateY(-2px)' : 'none',
                  boxShadow: activeTab === method.id ? '0 4px 6px -1px rgba(var(--primary-rgb), 0.1), 0 2px 4px -1px rgba(var(--primary-rgb), 0.06)' : 'none'
                }}
              >
                <span className="flex items-center">
                  {getMethodIcon(method.id)}
                  {method.name}
                  {isMethodComingSoon(method.id) && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                </span>
                {activeTab === method.id && (
                  <motion.div 
                    layoutId="activePill"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {country.paymentMethods.map((method) => (
            <TabsContent key={method.id} value={method.id} className="focus-visible:outline-none">
              {renderPaymentMethodContent(method.id)}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CountryPaymentMethods;
