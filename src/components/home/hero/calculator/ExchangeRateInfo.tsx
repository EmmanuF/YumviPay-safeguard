
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { useLocale } from '@/contexts/LocaleContext';

interface ExchangeRateInfoProps {
  isLoadingRate: boolean;
  sourceCurrency: string;
  exchangeRate: number;
  targetCurrency: string;
  refreshRate: () => void;
  lastRateUpdate: Date | null;
  itemVariants: any;
  rateLimitReached?: boolean;
}

const ExchangeRateInfo: React.FC<ExchangeRateInfoProps> = ({
  isLoadingRate,
  sourceCurrency,
  exchangeRate,
  targetCurrency,
  refreshRate,
  lastRateUpdate,
  itemVariants,
  rateLimitReached = false
}) => {
  const { t } = useLocale();
  
  // Format last updated time
  const formattedLastUpdate = lastRateUpdate 
    ? formatDistanceToNow(lastRateUpdate, { addSuffix: true }) 
    : 'never';
    
  return (
    <>
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div className="text-sm text-gray-600 font-medium bg-white/50 rounded-md py-2 px-4 flex-grow flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Exchange Rate</span>
          <span className="font-bold">
            1 {sourceCurrency} = {exchangeRate.toFixed(4)} {targetCurrency}
          </span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 bg-white/70"
          onClick={refreshRate}
          disabled={isLoadingRate}
        >
          <RefreshCw className={`h-4 w-4 ${isLoadingRate ? 'animate-spin' : ''}`} />
        </Button>
      </motion.div>
      
      {lastRateUpdate && (
        <motion.div
          variants={itemVariants}
          className="mt-2 text-xs text-center text-gray-500"
        >
          {rateLimitReached ? (
            <>Rate fixed - API quota reached</>
          ) : (
            <>Last updated: {formattedLastUpdate}</>
          )}
        </motion.div>
      )}
    </>
  );
};

export default ExchangeRateInfo;
