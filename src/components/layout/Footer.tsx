
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/LocaleContext';
import { useIsMobile } from '@/hooks/use-mobile';

// Social media icon component
const SocialIcon = ({ 
  icon, 
  href, 
  label 
}: { 
  icon: React.ReactNode; 
  href: string; 
  label: string 
}) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    aria-label={label}
    className="bg-primary-100 hover:bg-primary-200 text-primary-700 p-2.5 rounded-full transition-colors"
  >
    {icon}
  </a>
);

// Footer section component with collapsible behavior on mobile
const FooterSection = ({ 
  title, 
  children, 
  className 
}: { 
  title: string; 
  children: React.ReactNode;
  className?: string;
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const isMobile = useIsMobile();
  
  // Only make sections expandable on mobile
  if (isMobile) {
    return (
      <div className={cn("mb-6", className)}>
        <button 
          className="flex items-center justify-between w-full text-left mb-2"
          onClick={() => setExpanded(!expanded)}
        >
          <h3 className="text-sm font-semibold text-primary-800">{title}</h3>
          <ArrowRight 
            className={cn(
              "h-4 w-4 text-primary-500 transition-transform", 
              expanded ? "rotate-90" : ""
            )} 
          />
        </button>
        <div className={cn(
          "space-y-2.5 overflow-hidden transition-all", 
          expanded ? "max-h-96" : "max-h-0"
        )}>
          {children}
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("mb-6", className)}>
      <h3 className="text-sm font-semibold text-primary-800 mb-4">{title}</h3>
      <div className="space-y-2.5">
        {children}
      </div>
    </div>
  );
};

// Footer link component with optional external indicator
const FooterLink = ({ 
  to, 
  external = false, 
  children 
}: { 
  to: string; 
  external?: boolean; 
  children: React.ReactNode 
}) => {
  if (external) {
    return (
      <a 
        href={to} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-sm text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1"
      >
        {children}
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  }
  
  return (
    <Link 
      to={to} 
      className="text-sm text-gray-600 hover:text-primary-600 transition-colors inline-block py-1"
    >
      {children}
    </Link>
  );
};

// App download links component
const AppDownloadLinks = () => {
  const { t } = useLocale();
  
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 font-medium">{t('footer.app.download')}</p>
      <div className="flex space-x-3">
        <a 
          href="https://apps.apple.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="h-10"
        >
          <img 
            src="/app-store-badge.svg" 
            alt="Download on App Store" 
            className="h-full"
          />
        </a>
        <a 
          href="https://play.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="h-10"
        >
          <img 
            src="/google-play-badge.svg" 
            alt="Get it on Google Play" 
            className="h-full"
          />
        </a>
      </div>
    </div>
  );
};

// Newsletter subscription component
const NewsletterSubscription = () => {
  const { t } = useLocale();
  const [email, setEmail] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-gray-600 font-medium">{t('footer.newsletter')}</p>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder={t('footer.newsletter.placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border-gray-200"
          required
        />
        <Button type="submit" size="sm" className="bg-primary-600 hover:bg-primary-700">
          {t('footer.newsletter.button')}
        </Button>
      </div>
    </form>
  );
};

// Main Footer component
const Footer = () => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 pt-10 pb-6">
      <div className="container mx-auto px-5">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Company Information Column */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-primary-700 mb-2">{t('app.name')}</h2>
              <p className="text-sm text-gray-600">
                {t('app.tagline')}
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  123 Finance Street, Tech Valley<br />
                  Yaoundé, Cameroon
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-600 flex-shrink-0" />
                <a 
                  href="mailto:support@yumvi-pay.com" 
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  support@yumvi-pay.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-600 flex-shrink-0" />
                <a 
                  href="tel:+237123456789" 
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  +237 123 456 789
                </a>
              </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-primary-800 mb-4">
                {t('footer.follow')}
              </h3>
              <div className="flex space-x-3">
                <SocialIcon 
                  icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>} 
                  href="https://twitter.com/yumvipay" 
                  label="Twitter"
                />
                <SocialIcon 
                  icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>} 
                  href="https://facebook.com/yumvipay" 
                  label="Facebook"
                />
                <SocialIcon 
                  icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>} 
                  href="https://instagram.com/yumvipay" 
                  label="Instagram"
                />
                <SocialIcon 
                  icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>} 
                  href="https://linkedin.com/company/yumvipay" 
                  label="LinkedIn"
                />
              </div>
            </div>
          </div>
          
          {/* Navigation Links Columns */}
          <div className="md:col-span-8 lg:col-span-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
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
              <FooterSection title={t('footer.countries')} className="col-span-2 md:col-span-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <FooterLink to="/country/cameroon">Cameroon</FooterLink>
                  {/* More countries can be added here as the app expands */}
                </div>
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
        <Separator className="my-6 bg-gray-200" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            {t('footer.copyright')}
          </p>
          
          <div className="flex gap-6">
            <Link to="/terms" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">
              {t('footer.terms')}
            </Link>
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/cookies" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">
              {t('footer.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
