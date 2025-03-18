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
              {/* Company Links - Only keeping "About" which has a valid route */}
              <FooterSection title={t('footer.company')}>
                <FooterLink to="/about">{t('footer.about')}</FooterLink>
                {/* Disabling links without routes */}
                <span className="text-sm text-gray-400 py-1.5 block cursor-not-allowed">
                  {t('footer.careers')} (Coming Soon)
                </span>
                <span className="text-sm text-gray-400 py-1.5 block cursor-not-allowed">
                  {t('footer.press')} (Coming Soon)
                </span>
                <span className="text-sm text-gray-400 py-1.5 block cursor-not-allowed">
                  {t('footer.blog')} (Coming Soon)
                </span>
              </FooterSection>
              
              {/* Legal Links - Only keeping "Terms" and "Privacy" which have valid routes */}
              <FooterSection title={t('footer.legal')}>
                <FooterLink to="/terms">{t('footer.terms')}</FooterLink>
                <FooterLink to="/privacy">{t('footer.privacy')}</FooterLink>
                {/* Disabling links without routes */}
                <span className="text-sm text-gray-400 py-1.5 block cursor-not-allowed">
                  {t('footer.security')} (Coming Soon)
                </span>
                <span className="text-sm text-gray-400 py-1.5 block cursor-not-allowed">
                  {t('footer.compliance')} (Coming Soon)
                </span>
                <span className="text-sm text-gray-400 py-1.5 block cursor-not-allowed">
                  {t('footer.cookies')} (Coming Soon)
                </span>
              </FooterSection>
              
              {/* Help & Support Links - Only keeping "FAQ" and "Contact" which have valid routes */}
              <FooterSection title={t('footer.help')}>
                <FooterLink to="/faq">{t('footer.faq')}</FooterLink>
                <FooterLink to="/contact">{t('footer.contact')}</FooterLink>
                {/* Disabling link without route */}
                <span className="text-sm text-gray-400 py-1.5 block cursor-not-allowed">
                  {t('footer.support')} (Coming Soon)
                </span>
              </FooterSection>
              
              {/* Countries section - These all have valid routes */}
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
