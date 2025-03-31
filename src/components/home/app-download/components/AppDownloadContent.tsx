
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { AppleIcon, AndroidIcon } from '@/components/icons';
import { toast } from 'sonner';

interface AppDownloadContentProps {
  animationSettings: any;
}

export const AppDownloadContent: React.FC<AppDownloadContentProps> = ({ animationSettings }) => {
  const { t } = useLocale();
  
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
      ? t('app.download.ios.comingSoon') || 'iOS app coming soon!' 
      : t('app.download.android.comingSoon') || 'Android app coming soon!';
    
    // Show toast notification
    toast.info(message, {
      duration: 3000,
      position: 'bottom-center',
    });
    
    // Log analytics event
    console.log(`App download clicked: ${platform}`);
  };
  
  return (
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
      
      <UserAvatars />
    </motion.div>
  );
};

const UserAvatars: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="mt-8 flex items-center">
      <div className="flex -space-x-3">
        {/* Using direct URLs for user avatars for reliability */}
        {[
          "https://randomuser.me/api/portraits/men/32.jpg",
          "https://randomuser.me/api/portraits/women/44.jpg",
          "https://randomuser.me/api/portraits/women/46.jpg"
        ].map((src, index) => (
          <img 
            key={`user-avatar-${index}`}
            src={src} 
            alt="User" 
            className="w-10 h-10 rounded-full border-2 border-white"
            loading="lazy"
            width="40"
            height="40"
          />
        ))}
      </div>
      <span className="ml-4 text-sm text-gray-600">
        {t('app.download.users') || '10,000+ active users'}
      </span>
    </div>
  );
};
