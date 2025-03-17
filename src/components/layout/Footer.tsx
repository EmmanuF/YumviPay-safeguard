
import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Mail, Phone, MapPin, Globe, ArrowRight, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/LocaleContext';
import { useIsMobile } from '@/hooks/use-mobile';

// Social media icons component
const SocialIcon: React.FC<{ icon: React.ReactNode; href: string; label: string }> = ({ 
  icon, href, label 
}) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    aria-label={label}
    className="bg-primary-100/50 p-2 rounded-full hover:bg-primary-200/50 transition-colors"
  >
    {icon}
  </a>
);

// Footer section component
const FooterSection: React.FC<{ 
  title: string; 
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => {
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
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          <ArrowRight 
            className={cn(
              "h-4 w-4 text-gray-500 transition-transform", 
              expanded ? "rotate-90" : ""
            )} 
          />
        </button>
        <div className={cn(
          "space-y-2 overflow-hidden transition-all", 
          expanded ? "max-h-40" : "max-h-0"
        )}>
          {children}
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("mb-6", className)}>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

// Footer link component
const FooterLink: React.FC<{ to: string; external?: boolean; children: React.ReactNode }> = ({ 
  to, external = false, children 
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
      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
    >
      {children}
    </Link>
  );
};

// Countries list component
const CountriesList: React.FC = () => {
  // For now, we'll just show Cameroon as it's the MVP country
  return (
    <div className="grid grid-cols-2 gap-2">
      <FooterLink to="/country/cameroon">Cameroon</FooterLink>
      {/* Add more countries here as we expand */}
    </div>
  );
};

// Newsletter subscription component
const NewsletterSubscription: React.FC = () => {
  const { t } = useLocale();
  const [email, setEmail] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    // Reset form
    setEmail('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder={t('footer.newsletter.placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border-gray-200"
          required
        />
        <Button type="submit" variant="outline" size="sm">
          {t('footer.newsletter.button')}
        </Button>
      </div>
    </form>
  );
};

// App download links component
const AppDownloadLinks: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">{t('footer.app.download')}</p>
      <div className="flex space-x-2">
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

// Main Footer component
const Footer: React.FC = () => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-gray-50 pt-8 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Information */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-primary-700">{t('app.name')}</h2>
              <p className="text-sm text-gray-600 mt-2">
                {t('app.tagline')}
              </p>
            </div>
            
            <div className="mb-6 space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary-600 mt-0.5" />
                <p className="text-sm text-gray-600">
                  123 Finance Street, Tech Valley<br />
                  Yaoundé, Cameroon
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-600" />
                <a 
                  href="mailto:support@yumvi-pay.com" 
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  support@yumvi-pay.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-600" />
                <a 
                  href="tel:+237123456789" 
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  +237 123 456 789
                </a>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {t('footer.follow')}
              </h3>
              <div className="flex space-x-3">
                <SocialIcon 
                  icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>} 
                  href="https://twitter.com/yumvipay" 
                  label="Twitter"
                />
                <SocialIcon 
                  icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>} 
                  href="https://facebook.com/yumvipay" 
                  label="Facebook"
                />
                <SocialIcon 
                  icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>} 
                  href="https://instagram.com/yumvipay" 
                  label="Instagram"
                />
                <SocialIcon 
                  icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>} 
                  href="https://linkedin.com/company/yumvipay" 
                  label="LinkedIn"
                />
              </div>
            </div>
            
            {isMobile ? (
              <AppDownloadLinks />
            ) : null}
          </div>
          
          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 col-span-1 md:col-span-2 lg:col-span-2">
            <FooterSection title={t('footer.company')}>
              <FooterLink to="/about">{t('footer.about')}</FooterLink>
              <FooterLink to="/careers">{t('footer.careers')}</FooterLink>
              <FooterLink to="/press">{t('footer.press')}</FooterLink>
              <FooterLink to="/blog">{t('footer.blog')}</FooterLink>
            </FooterSection>
            
            <FooterSection title={t('footer.legal')}>
              <FooterLink to="/terms">{t('footer.terms')}</FooterLink>
              <FooterLink to="/privacy">{t('footer.privacy')}</FooterLink>
              <FooterLink to="/security">{t('footer.security')}</FooterLink>
              <FooterLink to="/compliance">{t('footer.compliance')}</FooterLink>
              <FooterLink to="/cookies">{t('footer.cookies')}</FooterLink>
            </FooterSection>
            
            <FooterSection title={t('footer.help')}>
              <FooterLink to="/faq">{t('footer.faq')}</FooterLink>
              <FooterLink to="/contact">{t('footer.contact')}</FooterLink>
              <FooterLink to="/support">{t('footer.support')}</FooterLink>
            </FooterSection>
            
            <FooterSection title={t('footer.countries')} className="col-span-2 md:col-span-3">
              <CountriesList />
            </FooterSection>
          </div>
          
          {/* Newsletter and App Download */}
          <div className="col-span-1 lg:col-span-1 space-y-6">
            {!isMobile ? (
              <AppDownloadLinks />
            ) : null}
            
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {t('footer.newsletter')}
              </h3>
              <NewsletterSubscription />
            </div>
          </div>
        </div>
        
        <Separator className="my-6 bg-gray-200" />
        
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-4 md:space-y-0">
          <p className="text-xs text-gray-500">
            {t('footer.copyright')}
          </p>
          
          <div className="flex space-x-4">
            <a href="/terms" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">
              {t('footer.terms')}
            </a>
            <a href="/privacy" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="/cookies" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">
              {t('footer.cookies')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
