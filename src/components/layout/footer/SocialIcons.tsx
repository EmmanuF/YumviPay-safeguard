
import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import SocialIcon from './SocialIcon';

const SocialIcons: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-primary-50 mb-2">
        {t('footer.follow')}
      </h3>
      <div className="flex space-x-4">
        <SocialIcon 
          href="https://twitter.com/yumvipay"
          label="Twitter"
          icon={<Twitter className="h-4 w-4" />}
        />
        
        <SocialIcon 
          href="https://facebook.com/yumvipay"
          label="Facebook"
          icon={<Facebook className="h-4 w-4" />}
        />
        
        <SocialIcon 
          href="https://instagram.com/yumvipay"
          label="Instagram"
          icon={<Instagram className="h-4 w-4" />}
        />
        
        <SocialIcon 
          href="https://linkedin.com/company/yumvipay"
          label="LinkedIn"
          icon={<Linkedin className="h-4 w-4" />}
        />
      </div>
    </div>
  );
};

export default SocialIcons;
