
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Zap, Shield } from 'lucide-react';
import HeroActions from './HeroActions';
import { useLocale } from '@/contexts/LocaleContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';

interface HeroTitleProps {
  onGetStarted: () => void;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ onGetStarted }) => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const { shouldUseComplexAnimations } = useDeviceOptimizations();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldUseComplexAnimations ? 0.7 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-8"
    >
      <div className="flex flex-col">
        <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-bold mb-6`}>
          <span className="text-indigo-600 drop-shadow-sm">{t('hero.title')}</span>
        </h1>
        
        <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-wrap items-center justify-between'} mt-2`}>
          <div className="flex items-center gap-3">
            <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-md">
              <Zap size={16} className="mr-1" />
              {t('hero.features.fast')}
            </span>
            <span className="bg-secondary-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-md">
              <Shield size={16} className="mr-1" />
              {t('hero.features.free')}
            </span>
          </div>
          
          <HeroActions onGetStarted={onGetStarted} />
        </div>
      </div>
      
      {shouldUseComplexAnimations && (
        <motion.div 
          className="absolute -top-5 -right-5 text-indigo-400 rotate-12 opacity-50"
          animate={{ rotate: [12, 5, 12], scale: [1, 1.05, 1] }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <Globe size={64} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default HeroTitle;
