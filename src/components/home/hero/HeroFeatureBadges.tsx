
import React from 'react';
import { Zap, ArrowRightLeft } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const HeroFeatureBadges: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="flex flex-wrap gap-3 mt-6 mb-2 justify-center md:justify-start">
      <div className="inline-flex items-center px-4 py-2 bg-green-700/70 backdrop-blur-sm rounded-full text-white text-sm">
        <Zap className="w-4 h-4 mr-2 text-green-300" />
        <span>{t('home.fastSecure')}</span>
      </div>
      
      <div className="inline-flex items-center px-4 py-2 bg-purple-700/70 backdrop-blur-sm rounded-full text-white text-sm">
        <ArrowRightLeft className="w-4 h-4 mr-2 text-purple-300" />
        <span>{t('home.freeTransfers')}</span>
      </div>
    </div>
  );
};

export default HeroFeatureBadges;
