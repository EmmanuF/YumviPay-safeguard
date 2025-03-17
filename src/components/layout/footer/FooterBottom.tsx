
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/contexts/LocaleContext';
import { Separator } from '@/components/ui/separator';

const FooterBottom: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <>
      <Separator className="my-6 bg-gray-200" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          {t('footer.copyright')}
        </p>
        
        <div className="flex gap-6">
          <Link to="/terms" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">
            {t('footer.terms')}
          </Link>
          <Link to="/privacy" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">
            {t('footer.privacy')}
          </Link>
          <Link to="/cookies" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">
            {t('footer.cookies')}
          </Link>
        </div>
      </div>
    </>
  );
};

export default FooterBottom;
