
import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Smartphone } from 'lucide-react';

const AppDownloadLinks: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="space-y-3">
      <p className="text-base font-semibold text-primary-300 mb-3 flex items-center gap-2">
        <Smartphone className="h-5 w-5" />
        {t('footer.app.download')}
      </p>
      <div className="flex flex-row gap-3">
        <a 
          href="https://apps.apple.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block h-10 transform hover:scale-110 transition-all duration-300 hover:opacity-90 rounded-lg shadow-md hover:shadow-lg"
          aria-label="Download on App Store"
        >
          <img 
            src="/app-store-badge.svg" 
            alt="Download on App Store" 
            className="h-full w-auto rounded-lg border border-white/20"
          />
        </a>
        <a 
          href="https://play.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block h-10 transform hover:scale-110 transition-all duration-300 hover:opacity-90 rounded-lg shadow-md hover:shadow-lg"
          aria-label="Get it on Google Play"
        >
          <img 
            src="/google-play-badge.svg" 
            alt="Get it on Google Play" 
            className="h-full w-auto rounded-lg border border-white/20"
          />
        </a>
      </div>
    </div>
  );
};

export default AppDownloadLinks;
