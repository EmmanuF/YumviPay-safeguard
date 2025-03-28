
import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import SocialIcons from './SocialIcons';

const FooterBottom: React.FC = () => {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="mt-16 pt-8 border-t border-indigo-700">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-300">
            &copy; {currentYear} Yumvi-Pay Inc. {t('footer.rights')}
          </p>
        </div>
        <SocialIcons />
      </div>
    </div>
  );
};

export default FooterBottom;
