
import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext';
import { HeroActions } from './index';

interface HeroTitleProps {
  onGetStarted: () => void;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ onGetStarted }) => {
  const { t } = useLocale();
  
  return (
    <div className="text-center max-w-3xl mx-auto px-3">
      <motion.h1 
        className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-700 via-primary-500 to-secondary-500 whitespace-nowrap"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {t('hero.title')}
      </motion.h1>

      <motion.h2
        className="text-lg md:text-xl text-indigo-700 font-medium mb-6 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        {t('hero.subheading')}
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        className="mb-8"
      >
        <HeroActions onGetStarted={onGetStarted} />
      </motion.div>
    </div>
  );
};

export default HeroTitle;
