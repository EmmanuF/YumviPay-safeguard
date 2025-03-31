
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { AppleIcon, AndroidIcon } from '@/components/icons';

const AppDownload: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass-effect rounded-3xl overflow-hidden border shadow-lg"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-4">
                  {t('app.download.title')}
                </h2>
                <p className="text-base md:text-lg text-gray-700 mb-6">
                  {t('app.download.description')}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button variant="default" size="lg" className="rounded-xl">
                    <AppleIcon className="mr-2 h-5 w-5" />
                    App Store
                  </Button>
                  <Button variant="secondary" size="lg" className="rounded-xl">
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
                    {t('app.download.users')}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                <img 
                  src="/lovable-uploads/67dfa296-0c6e-451a-92f2-dcac30ae9f26.png" 
                  alt="Yumvi-Pay Mobile App" 
                  className="w-full max-w-[450px] md:max-w-[500px] object-contain shadow-2xl rounded-2xl"
                  loading="eager"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    e.currentTarget.onerror = null; // Prevent infinite loop
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppDownload;
