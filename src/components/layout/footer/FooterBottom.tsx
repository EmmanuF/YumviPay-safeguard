
import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const FooterBottom: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="mt-12 pt-6 border-t border-indigo-800">
      <div className="flex flex-row justify-between items-center bg-indigo-800 rounded-lg p-4 text-white">
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
            className="bg-white hover:bg-primary-100 text-indigo-700 p-1.5 rounded-full transition-colors hover:scale-110"
          >
            <Twitter className="h-4 w-4" />
          </a>
          
          <a 
            href="https://facebook.com/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="bg-white hover:bg-primary-100 text-indigo-700 p-1.5 rounded-full transition-colors hover:scale-110"
          >
            <Facebook className="h-4 w-4" />
          </a>
          
          <a 
            href="https://instagram.com/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="bg-white hover:bg-primary-100 text-indigo-700 p-1.5 rounded-full transition-colors hover:scale-110"
          >
            <Instagram className="h-4 w-4" />
          </a>
          
          <a 
            href="https://linkedin.com/company/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="bg-white hover:bg-primary-100 text-indigo-700 p-1.5 rounded-full transition-colors hover:scale-110"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
