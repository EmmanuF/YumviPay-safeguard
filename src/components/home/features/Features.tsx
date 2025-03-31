
import React from 'react';
import { motion } from 'framer-motion';
import { FeatureCard, ExchangeRateIcon, TransparencyIcon, SecureKycIcon } from './';
import { useLocale } from '@/contexts/LocaleContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';

const Features = () => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const { shouldUseHeavyAnimations } = useDeviceOptimizations();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldUseHeavyAnimations() ? 0.3 : 0.1,
        delayChildren: shouldUseHeavyAnimations() ? 0.3 : 0.1
      }
    }
  };

  return (
    <motion.div 
      id="features"
      className={`mt-16 mb-14 ${isMobile ? 'px-4' : ''}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: shouldUseHeavyAnimations() ? 0.8 : 0.4 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-10">
        <motion.h2 
          className="text-3xl font-bold mb-3 text-gradient-primary"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldUseHeavyAnimations() ? 0.5 : 0.3, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {t('features.title')}
        </motion.h2>
        <motion.p 
          className="text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldUseHeavyAnimations() ? 0.5 : 0.3, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {t('features.subtitle')}
        </motion.p>
      </div>

      <motion.div 
        className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'md:grid-cols-3 gap-6'} px-4 md:px-6`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <FeatureCard 
          icon={<ExchangeRateIcon />}
          title={t('features.rates.title')}
          description={t('features.rates.description')}
          colorScheme="green"
        />
        
        <FeatureCard 
          icon={<TransparencyIcon />}
          title={t('features.transparent.title')}
          description={t('features.transparent.description')}
          colorScheme="purple"
        />
        
        <FeatureCard 
          icon={<SecureKycIcon />}
          title={t('features.secure.title')}
          description={t('features.secure.description')}
          colorScheme="orange"
        />
      </motion.div>
    </motion.div>
  );
};

export default Features;
