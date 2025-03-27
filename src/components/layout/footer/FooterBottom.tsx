
import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const FooterBottom: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="mt-12 pt-6 border-t border-white/10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-white/70">
          © {new Date().getFullYear()} Yumvi-Pay. All rights reserved.
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="mr-2 text-sm font-medium text-white/80">Follow Us</span>
          <a 
            href="https://twitter.com/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full transition-colors hover:scale-110"
          >
            <Twitter className="h-4 w-4" />
          </a>
          
          <a 
            href="https://facebook.com/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full transition-colors hover:scale-110"
          >
            <Facebook className="h-4 w-4" />
          </a>
          
          <a 
            href="https://instagram.com/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full transition-colors hover:scale-110"
          >
            <Instagram className="h-4 w-4" />
          </a>
          
          <a 
            href="https://linkedin.com/company/yumvipay" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full transition-colors hover:scale-110"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
