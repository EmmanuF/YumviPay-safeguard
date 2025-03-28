
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProviderById } from '@/data/cameroonPaymentProviders';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Award } from 'lucide-react';
import { getProviderLogoSrc } from '@/utils/providerLogos';
import { cn } from '@/lib/utils';

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
  // Auto-select the first provider if none is selected
  useEffect(() => {
    if (providers.length > 0 && !selectedProvider) {
      onSelectProvider(providers[0].id);
    }
  }, [providers, selectedProvider, onSelectProvider]);

  // Helper functions
  const isProviderComingSoon = (providerId: string) => {
    return providerId === 'yoomee_money' || providerId.includes('afriland') || providerId.includes('ecobank');
  };

  if (!providers || providers.length === 0) {
    return <p className="text-sm text-muted-foreground py-2">No providers available</p>;
  }

  // For desktop view (side-by-side)
  const isDesktopView = providers.length === 2 && 
    (providers.some(p => p.id.includes('mtn')) && providers.some(p => p.id.includes('orange')));

  return (
    <div className={cn(
      "mt-4",
      isDesktopView ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"
    )}>
      {providers.map((provider) => {
        const comingSoon = isProviderComingSoon(provider.id);
        const providerDetails = getProviderById(provider.id);
        const logoSrc = getProviderLogoSrc(provider.id);
        const isSelected = selectedProvider === provider.id;
        
        return (
          <motion.div 
            key={provider.id}
            whileHover={!comingSoon ? { scale: 1.02 } : {}}
            whileTap={!comingSoon ? { scale: 0.98 } : {}}
            onClick={() => !comingSoon && onSelectProvider(provider.id)}
            className={cn(
              "rounded-xl p-4 cursor-pointer transition-all duration-200 border-2",
              isSelected && !comingSoon ? "border-primary-500 bg-primary-50/50 shadow-md" : "border-gray-200",
              comingSoon ? "opacity-60 cursor-not-allowed" : "hover:border-gray-300",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-16 h-16 rounded-md overflow-hidden flex items-center justify-center bg-white p-2",
                  isSelected ? "ring-2 ring-primary-300" : ""
                )}>
                  <img 
                    src={logoSrc}
                    alt={provider.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
                
                <div>
                  <p className="font-medium text-foreground">{provider.name}</p>
                  
                  {providerDetails?.processingTime && !comingSoon && (
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <Clock className="h-3 w-3 mr-1 text-amber-500" />
                      <span>{providerDetails.processingTime}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {providerDetails?.popularityScore && providerDetails.popularityScore >= 4 && !comingSoon && (
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                  <Award className="h-3 w-3 mr-1" /> Popular
                </Badge>
              )}
              
              {comingSoon && (
                <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                  Coming Soon
                </Badge>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProviderList;
