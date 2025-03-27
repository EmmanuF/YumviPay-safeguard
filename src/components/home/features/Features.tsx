
import React from 'react';
import { motion } from 'framer-motion';
import { FeatureCard, ExchangeRateIcon, TransparencyIcon, SecureKycIcon } from './';

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.div 
      id="features"
      className="mt-20 mb-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl font-bold mb-3 text-gradient-primary"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Why Choose Yumvi-Pay
        </motion.h2>
        <motion.p 
          className="text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          We offer the best experience for sending money to Africa
        </motion.p>
      </div>

      <motion.div 
        className="grid md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <FeatureCard 
          icon={<ExchangeRateIcon />}
          title="Best Exchange Rates"
          description="We offer competitive exchange rates that ensure your money goes further when sending to Africa."
        />
        
        <FeatureCard 
          icon={<TransparencyIcon />}
          title="Simple & Transparent"
          description="Know exactly how much your recipient will get before you send, with no hidden fees or charges."
        />
        
        <FeatureCard 
          icon={<SecureKycIcon />}
          title="Secure & Fast KYC"
          description="Our integrated verification ensures safe and quick transactions with minimal waiting time."
        />
      </motion.div>
    </motion.div>
  );
};

export default Features;
