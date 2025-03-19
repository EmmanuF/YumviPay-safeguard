
import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const FooterBottom: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="mt-12 pt-6 border-t border-gray-200">
      <div className="flex flex-row justify-between items-center bg-primary-400 rounded-lg p-4 text-white">
        <div className="text-sm text-white">
          © {new Date().getFullYear()} Yumvi-Pay. All rights reserved.
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="mr-2 text-sm font-medium">Follow Us</span>
          <a 
            href="https://twitter.com/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="bg-white hover:bg-primary-100 text-primary-600 p-1.5 rounded-full transition-colors"
          >
            <Twitter className="h-4 w-4" />
          </a>
          
          <a 
            href="https://facebook.com/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="bg-white hover:bg-primary-100 text-primary-600 p-1.5 rounded-full transition-colors"
          >
            <Facebook className="h-4 w-4" />
          </a>
          
          <a 
            href="https://instagram.com/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="bg-white hover:bg-primary-100 text-primary-600 p-1.5 rounded-full transition-colors"
          >
            <Instagram className="h-4 w-4" />
          </a>
          
          <a 
            href="https://linkedin.com/company/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="bg-white hover:bg-primary-100 text-primary-600 p-1.5 rounded-full transition-colors"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
