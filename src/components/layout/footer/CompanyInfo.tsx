
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const CompanyInfo: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary-700 mb-2">{t('app.name')}</h2>
        <p className="text-sm text-gray-600">
          {t('app.tagline')}
        </p>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            123 Finance Street, Tech Valley<br />
            Yaoundé, Cameroon
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary-600 flex-shrink-0" />
          <a 
            href="mailto:support@yumvi-pay.com" 
            className="text-sm text-gray-600 hover:text-primary-600"
          >
            support@yumvi-pay.com
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-primary-600 flex-shrink-0" />
          <a 
            href="tel:+237123456789" 
            className="text-sm text-gray-600 hover:text-primary-600"
          >
            +237 123 456 789
          </a>
        </div>
      </div>
    </>
  );
};

export default CompanyInfo;
