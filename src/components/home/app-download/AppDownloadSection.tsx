
import React from 'react';
import { motion } from 'framer-motion';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';
import { AppDownloadContent } from './components/AppDownloadContent';
import { AppPreviewImage } from './components/AppPreviewImage';

export const AppDownloadSection: React.FC = () => {
  const { getOptimizedAnimationSettings } = useDeviceOptimizations();
  
  // Optimize animations based on device capabilities
  const animationSettings = getOptimizedAnimationSettings();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: animationSettings.duration,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="glass-effect rounded-3xl overflow-hidden border shadow-lg"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <AppDownloadContent animationSettings={animationSettings} />
              <AppPreviewImage animationSettings={animationSettings} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
