
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const HeroFeatureBadges: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="flex flex-wrap items-center gap-2 mt-4 justify-center sm:justify-start"
    >
      <span className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center shadow-sm">
        <Zap size={16} className="mr-1.5" strokeWidth={2.5} />
        {t('hero.features.fast')}
      </span>
      <span className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center shadow-sm">
        <Shield size={16} className="mr-1.5" strokeWidth={2.5} />
        {t('hero.features.free')}
      </span>
    </motion.div>
  );
};

export default HeroFeatureBadges;
