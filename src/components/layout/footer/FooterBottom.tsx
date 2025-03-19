
import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const FooterBottom: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="mt-12 pt-6 border-t border-mocha-300/30">
      <div className="flex flex-row justify-between items-center bg-secondary-500 rounded-lg p-4 text-white shadow-md">
        <div className="text-sm text-cream-500 font-medium">
          © {new Date().getFullYear()} Yumvi-Pay. All rights reserved.
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="mr-2 text-sm font-medium text-cream-300">Follow Us</span>
          <a 
            href="https://twitter.com/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="bg-cream-500 hover:bg-cream-400 text-secondary-700 p-1.5 rounded-full transition-colors shadow-sm"
          >
            <Twitter className="h-4 w-4" />
          </a>
          
          <a 
            href="https://facebook.com/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="bg-cream-500 hover:bg-cream-400 text-secondary-700 p-1.5 rounded-full transition-colors shadow-sm"
          >
            <Facebook className="h-4 w-4" />
          </a>
          
          <a 
            href="https://instagram.com/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="bg-cream-500 hover:bg-cream-400 text-secondary-700 p-1.5 rounded-full transition-colors shadow-sm"
          >
            <Instagram className="h-4 w-4" />
          </a>
          
          <a 
            href="https://linkedin.com/company/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="bg-cream-500 hover:bg-cream-400 text-secondary-700 p-1.5 rounded-full transition-colors shadow-sm"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
