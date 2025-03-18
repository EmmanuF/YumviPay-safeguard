
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocale } from '@/contexts/LocaleContext';
import {
  FooterSection,
  FooterLink,
  AppDownloadLinks,
  NewsletterSubscription,
  CompanyInfo,
  FooterBottom
} from './footer';

// Main Footer component
const Footer = () => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 pt-12 pb-6">
      <div className="container mx-auto px-5">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Company Information Column */}
          <div className="md:col-span-4 lg:col-span-3">
            <CompanyInfo />
            
            {/* App Download Links moved to bottom left */}
            <div className="mt-8">
              <AppDownloadLinks />
            </div>
          </div>
          
          {/* Navigation Links Columns */}
          <div className="md:col-span-8 lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
              {/* Company Links */}
              <FooterSection title={t('footer.company')}>
                <FooterLink to="/about">{t('footer.about')}</FooterLink>
                <FooterLink to="/careers" disabled>{t('footer.careers')} (Coming Soon)</FooterLink>
                <FooterLink to="/press" disabled>{t('footer.press')} (Coming Soon)</FooterLink>
                <FooterLink to="/blog" disabled>{t('footer.blog')} (Coming Soon)</FooterLink>
              </FooterSection>
              
              {/* Legal Links */}
              <FooterSection title={t('footer.legal')}>
                <FooterLink to="/terms">{t('footer.terms')}</FooterLink>
                <FooterLink to="/privacy">{t('footer.privacy')}</FooterLink>
                <FooterLink to="/security" disabled>{t('footer.security')} (Coming Soon)</FooterLink>
                <FooterLink to="/compliance" disabled>{t('footer.compliance')} (Coming Soon)</FooterLink>
                <FooterLink to="/cookies" disabled>{t('footer.cookies')} (Coming Soon)</FooterLink>
              </FooterSection>
              
              {/* Help & Support Links */}
              <FooterSection title={t('footer.help')}>
                <FooterLink to="/faq">{t('footer.faq')}</FooterLink>
                <FooterLink to="/contact">{t('footer.contact')}</FooterLink>
                <FooterLink to="/support" disabled>{t('footer.support')} (Coming Soon)</FooterLink>
              </FooterSection>
              
              {/* Countries section */}
              <FooterSection title={t('footer.countries')}>
                <FooterLink to="/country/cameroon">Cameroon</FooterLink>
                <FooterLink to="/country/senegal">Senegal</FooterLink>
                <FooterLink to="/country/nigeria">Nigeria</FooterLink>
                <FooterLink to="/country/ghana">Ghana</FooterLink>
                <FooterLink to="/country/kenya">Kenya</FooterLink>
              </FooterSection>
            </div>
          </div>
          
          {/* Newsletter Column */}
          <div className="md:col-span-12 lg:col-span-3 space-y-8">
            <NewsletterSubscription />
          </div>
        </div>
        
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
