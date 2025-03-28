
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
    <footer className="relative pt-16 pb-6">
      {/* Gradient glow transition effect */}
      <div className="absolute inset-0 -top-40 w-full bg-gradient-to-b from-transparent via-indigo-900/30 to-indigo-800/95 pointer-events-none"></div>
      
      {/* Main footer background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-800/95 to-indigo-900 pointer-events-none"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="footer-bubble footer-bubble-1"></div>
        <div className="footer-bubble footer-bubble-2"></div>
        <div className="footer-bubble footer-bubble-3"></div>
        {/* Animated lines */}
        <div className="footer-line footer-line-1"></div>
        <div className="footer-line footer-line-2"></div>
        <div className="footer-line footer-line-3"></div>
      </div>

      {/* Subtle top separator with enhanced glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-300/20 via-primary-300/60 to-primary-300/20"></div>
      <div className="absolute top-1 left-0 w-full h-8 bg-gradient-to-b from-white/10 to-transparent"></div>
      
      {/* Horizontal light beam effect */}
      <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300/40 to-transparent"></div>
      
      <div className="container mx-auto px-5 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
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
          
          {/* Newsletter Column - better aligned with padding */}
          <div className="md:col-span-12 lg:col-span-3 pt-4 lg:pt-0">
            <NewsletterSubscription />
          </div>
        </div>
        
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
