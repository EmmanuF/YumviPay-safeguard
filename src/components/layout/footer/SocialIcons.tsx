
import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const SocialIcons: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-primary-800 mb-3">
        {t('footer.follow')}
      </h3>
      <div className="flex space-x-3">
        <a 
          href="https://twitter.com/yumvipay" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="bg-primary-100 hover:bg-primary-200 text-primary-700 p-2 rounded-full transition-colors"
        >
          <Twitter className="h-4 w-4" />
        </a>
        
        <a 
          href="https://facebook.com/yumvipay" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="bg-primary-100 hover:bg-primary-200 text-primary-700 p-2 rounded-full transition-colors"
        >
          <Facebook className="h-4 w-4" />
        </a>
        
        <a 
          href="https://instagram.com/yumvipay" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="bg-primary-100 hover:bg-primary-200 text-primary-700 p-2 rounded-full transition-colors"
        >
          <Instagram className="h-4 w-4" />
        </a>
        
        <a 
          href="https://linkedin.com/company/yumvipay" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="bg-primary-100 hover:bg-primary-200 text-primary-700 p-2 rounded-full transition-colors"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default SocialIcons;
