
import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';

const AppDownloadLinks: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="space-y-3">
      <p className="text-base font-semibold text-primary-800 mb-2">{t('footer.app.download')}</p>
      <div className="flex space-x-3">
        <a 
          href="https://apps.apple.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="h-10"
        >
          <img 
            src="/app-store-badge.svg" 
            alt="Download on App Store" 
            className="h-full"
          />
        </a>
        <a 
          href="https://play.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="h-10"
        >
          <img 
            src="/google-play-badge.svg" 
            alt="Get it on Google Play" 
            className="h-full"
          />
        </a>
      </div>
    </div>
  );
};

export default AppDownloadLinks;
