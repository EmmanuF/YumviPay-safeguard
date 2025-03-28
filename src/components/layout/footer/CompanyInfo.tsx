
import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const CompanyInfo: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">{t('app.name')}</h2>
        <p className="text-sm text-gray-300">
          {t('app.tagline')}
        </p>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            2470 S DAIRY ASHFORD RD<br />
            HOUSTON TX 77077
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
          <a 
            href="mailto:support@yumvipay.com" 
            className="text-sm text-gray-300 hover:text-white"
          >
            support@yumvipay.com
          </a>
        </div>
      </div>
    </>
  );
};

export default CompanyInfo;
