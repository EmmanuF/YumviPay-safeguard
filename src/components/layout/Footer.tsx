
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocale } from '@/contexts/LocaleContext';
import {
  FooterSection,
  FooterLink,
  AppDownloadLinks,
  NewsletterSubscription,
  SocialIcons,
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
            <SocialIcons />
          </div>
          
          {/* Navigation Links Columns */}
          <div className="md:col-span-8 lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
              {/* Company Links */}
              <FooterSection title={t('footer.company')}>
                <FooterLink to="/about">{t('footer.about')}</FooterLink>
                <FooterLink to="/careers">{t('footer.careers')}</FooterLink>
                <FooterLink to="/press">{t('footer.press')}</FooterLink>
                <FooterLink to="/blog">{t('footer.blog')}</FooterLink>
              </FooterSection>
              
              {/* Legal Links */}
              <FooterSection title={t('footer.legal')}>
                <FooterLink to="/terms">{t('footer.terms')}</FooterLink>
                <FooterLink to="/privacy">{t('footer.privacy')}</FooterLink>
                <FooterLink to="/security">{t('footer.security')}</FooterLink>
                <FooterLink to="/compliance">{t('footer.compliance')}</FooterLink>
                <FooterLink to="/cookies">{t('footer.cookies')}</FooterLink>
              </FooterSection>
              
              {/* Help & Support Links */}
              <FooterSection title={t('footer.help')}>
                <FooterLink to="/faq">{t('footer.faq')}</FooterLink>
                <FooterLink to="/contact">{t('footer.contact')}</FooterLink>
                <FooterLink to="/support">{t('footer.support')}</FooterLink>
              </FooterSection>
              
              {/* Countries */}
              <FooterSection title={t('footer.countries')}>
                <FooterLink to="/country/cameroon">Cameroon</FooterLink>
                {/* Placeholder for future countries */}
                <FooterLink to="/country/senegal">Senegal</FooterLink>
                <FooterLink to="/country/nigeria">Nigeria</FooterLink>
                <FooterLink to="/country/ghana">Ghana</FooterLink>
                <FooterLink to="/country/kenya">Kenya</FooterLink>
              </FooterSection>
            </div>
          </div>
          
          {/* Newsletter and App Download Column */}
          <div className="md:col-span-12 lg:col-span-3 space-y-8">
            <AppDownloadLinks />
            <NewsletterSubscription />
          </div>
        </div>
        
        {/* Footer Bottom Bar */}
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
