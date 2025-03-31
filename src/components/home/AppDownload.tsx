
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { AppleIcon, AndroidIcon } from '@/components/icons';
import { toast } from 'sonner';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';

const AppDownload: React.FC = () => {
  const { t } = useLocale();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
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
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: animationSettings.duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
  
  const handleAppDownload = (platform: 'ios' | 'android') => {
    // In a production environment, these would link to actual app stores
    const message = platform === 'ios' 
      ? t('app.download.ios.comingSoon', 'iOS app coming soon!') 
      : t('app.download.android.comingSoon', 'Android app coming soon!');
    
    // Show toast notification - fixed parameter type to match sonner's API
    toast.info(message, {
      duration: 3000,
      position: 'bottom-center',
    });
    
    // Log analytics event
    console.log(`App download clicked: ${platform}`);
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
              <motion.div 
                className="flex-1"
                variants={itemVariants}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-4">
                  {t('app.download.title') || 'Download Our Mobile App'}
                </h2>
                <p className="text-base md:text-lg text-gray-700 mb-6">
                  {t('app.download.description') || 'Get the best experience with our mobile app. Send money on the go, track transactions, and receive notifications.'}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="rounded-xl"
                    onClick={() => handleAppDownload('ios')}
                  >
                    <AppleIcon className="mr-2 h-5 w-5" />
                    App Store
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="rounded-xl"
                    onClick={() => handleAppDownload('android')}
                  >
                    <AndroidIcon className="mr-2 h-5 w-5" />
                    Google Play
                  </Button>
                </div>
                
                <div className="mt-8 flex items-center">
                  <div className="flex -space-x-3">
                    {/* Using direct URLs for user avatars for reliability */}
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="User" 
                      className="w-10 h-10 rounded-full border-2 border-white"
                      loading="lazy"
                    />
                    <img 
                      src="https://randomuser.me/api/portraits/women/44.jpg" 
                      alt="User" 
                      className="w-10 h-10 rounded-full border-2 border-white"
                      loading="lazy"
                    />
                    <img 
                      src="https://randomuser.me/api/portraits/women/46.jpg" 
                      alt="User" 
                      className="w-10 h-10 rounded-full border-2 border-white"
                      loading="lazy"
                    />
                  </div>
                  <span className="ml-4 text-sm text-gray-600">
                    {t('app.download.users') || '10,000+ active users'}
                  </span>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto relative"
                variants={itemVariants}
              >
                {imageLoading && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-30 backdrop-blur-sm rounded-2xl">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="rounded-full bg-gray-200 h-12 w-12 mb-2"></div>
                      <div className="h-2 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                )}
                
                <img 
                  src="/lovable-uploads/010ee2ae-dd5f-4717-b990-1077b6f9edac.png" 
                  alt="Yumvi-Pay Mobile App" 
                  className={`w-full max-w-[280px] md:max-w-[320px] object-contain rounded-2xl ${imageError ? 'border border-red-300' : 'shadow-lg'}`}
                  loading="eager"
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    setImageLoading(false);
                    setImageError(true);
                    // Use an inline fallback image instead of changing src to prevent potential loops
                    toast.error("Failed to load app preview image", {
                      description: "Please check your internet connection",
                      duration: 3000
                    });
                  }}
                  style={{
                    aspectRatio: '9/16',
                    objectFit: 'contain',
                    transform: imageError ? 'none' : 'translateY(-20px) rotate(-5deg)'
                  }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppDownload;
