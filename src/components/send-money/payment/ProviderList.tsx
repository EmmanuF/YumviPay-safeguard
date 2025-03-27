
import React from 'react';
import { getProviderById } from '@/data/cameroonPaymentProviders';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle } from 'lucide-react';
import { getProviderLogoSrc } from '@/utils/providerLogos';

interface ProviderListProps {
  providers: Array<{ id: string; name: string }>;
  selectedProvider: string | undefined;
  methodId: string;
  onSelectProvider: (providerId: string) => void;
}

const ProviderList: React.FC<ProviderListProps> = ({
  providers,
  selectedProvider,
  methodId,
  onSelectProvider
}) => {
  // Helper functions
  const isProviderComingSoon = (providerId: string) => {
    return providerId === 'yoomee_money' || providerId.includes('afriland') || providerId.includes('ecobank');
  };

  if (!providers || providers.length === 0) {
    return <p className="text-sm text-muted-foreground py-2">No providers available</p>;
  }

  return (
    <RadioGroup 
      value={selectedProvider} 
      onValueChange={(value) => onSelectProvider(value)}
      className="space-y-4 mt-4"
    >
      {providers.map((provider) => {
        const comingSoon = isProviderComingSoon(provider.id);
        const providerDetails = getProviderById(provider.id);
        const logoSrc = getProviderLogoSrc(provider.id);
        
        return (
          <div 
            key={provider.id} 
            className={`flex items-center space-x-3 border p-4 rounded-md ${
              comingSoon ? "bg-gray-50 border-gray-200" : ""
            }`}
          >
            {!comingSoon && (
              <RadioGroupItem value={provider.id} id={provider.id} disabled={comingSoon} />
            )}
            <div className="flex items-center justify-between flex-1">
              <div className="flex items-center space-x-4">
                <div className="w-48 h-28 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img 
                    src={logoSrc}
                    alt={provider.name} 
                    className={`w-full h-full object-contain ${comingSoon ? "opacity-50" : ""}`} 
                  />
                </div>
                <Label 
                  htmlFor={provider.id} 
                  className={`font-medium cursor-pointer ${comingSoon ? "text-gray-500" : ""}`}
                >
                  {provider.name}
                </Label>
              </div>
              
              {providerDetails?.processingTime && !comingSoon && (
                <div className="text-sm text-gray-600 flex items-center bg-gray-50 py-1.5 px-3 rounded-full">
                  <Clock className="h-4 w-4 mr-1.5 text-amber-500" />
                  <span>{providerDetails.processingTime}</span>
                </div>
              )}
              
              {comingSoon && (
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs font-normal">
                  <Clock className="h-3 w-3 mr-1" /> Coming Soon
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default ProviderList;
