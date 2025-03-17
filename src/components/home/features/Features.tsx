
import React from 'react';
import { motion } from 'framer-motion';
import { FeatureCard, ExchangeRateIcon, TransparencyIcon, SecureKycIcon } from './';

const Features = () => {
  return (
    <motion.div 
      id="features"
      className="mt-20 grid md:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <FeatureCard 
        icon={<ExchangeRateIcon />}
        title="Best Exchange Rates"
        description="We offer competitive exchange rates that ensure your money goes further."
      />
      
      <FeatureCard 
        icon={<TransparencyIcon />}
        title="Simple & Transparent"
        description="Know exactly how much your recipient will get before you send."
      />
      
      <FeatureCard 
        icon={<SecureKycIcon />}
        title="Secure & Fast KYC"
        description="Our integrated verification ensures safe and quick transactions."
      />
    </motion.div>
  );
};

export default Features;
