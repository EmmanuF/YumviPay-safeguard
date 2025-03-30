
import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext';

const HeroDescription: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-lg text-gray-700 max-w-2xl text-center mb-10"
    >
      {t('hero.subtitle')}
    </motion.p>
  );
};

export default HeroDescription;
