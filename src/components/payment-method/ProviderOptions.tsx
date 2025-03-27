
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/LocaleContext';
import { getProviderById } from '@/data/cameroonPaymentProviders';
import { Shield, Award, Clock } from 'lucide-react';
import { getProviderLogoSrc, generateProviderLogo } from '@/utils/providerLogos';

interface ProviderOptionsProps {
  options: Array<{
    id: string;
    name: string;
  }>;
  selectedOption: string;
  onSelect: (optionId: string) => void;
  methodId?: string;
}

const ProviderOptions: React.FC<ProviderOptionsProps> = ({
  options,
  selectedOption,
  onSelect,
  methodId = 'mobile_money',
}) => {
  const { t } = useLocale();
  
  // Auto-select the first option if none is selected
  useEffect(() => {
    if (options.length > 0 && !selectedOption) {
      onSelect(options[0].id);
    }
  }, [options, selectedOption, onSelect]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        // Get enhanced provider data
        const providerDetails = getProviderById(option.id);
        const isPopular = providerDetails?.popularityScore && providerDetails.popularityScore >= 4;
        const logoSrc = getProviderLogoSrc(option.id);
        
        return (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option.id)}
            className={cn(
              "p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center justify-center relative",
              selectedOption === option.id
                ? "border-primary-500 bg-primary-50 text-primary-700 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            )}
          >
            {isPopular && (
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full px-2 py-0.5 text-xs font-medium flex items-center">
                <Award className="h-3 w-3 mr-1" />
                <span>Popular</span>
              </div>
            )}
            
            <div className="mb-3 flex items-center justify-center h-12 w-full">
              <img 
                src={logoSrc}
                alt={option.name} 
                className="h-full object-contain max-w-[100px]" 
                onError={(e) => {
                  console.error(`Failed to load provider image: ${option.id}`);
                  const target = e.currentTarget;
                  target.src = generateProviderLogo(option.id);
                }}
              />
            </div>
            
            <div className="text-center font-medium">
              {t(`payment.${option.id}`) || option.name}
            </div>
            
            {providerDetails?.processingTime && (
              <div className="mt-2 text-xs text-gray-600 flex items-center justify-center bg-gray-50 w-full py-1 px-2 rounded">
                <Clock className="h-3 w-3 mr-1 text-amber-500" />
                <span>Delivery: {providerDetails.processingTime}</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProviderOptions;
