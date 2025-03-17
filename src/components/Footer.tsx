
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();
  
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
      }
    }
  };
  
  const iconVariants = {
    hover: { scale: 1.1, y: -3 }
  };
  
  return (
    <motion.footer 
      className="bg-gradient-to-b from-primary-600 to-primary-800 text-white py-8 mt-auto overflow-hidden relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t('app.name')}</h3>
            <p className="text-sm text-primary-100">
              {t('footer.companyDescription')}
            </p>
            <div className="flex space-x-4 pt-2">
              <motion.a 
                href="#" 
                className="text-primary-100 hover:text-white transition-colors"
                whileHover="hover"
                variants={iconVariants}
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-primary-100 hover:text-white transition-colors"
                whileHover="hover"
                variants={iconVariants}
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-primary-100 hover:text-white transition-colors"
                whileHover="hover"
                variants={iconVariants}
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </div>
          
          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-primary-100 hover:text-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-primary-100 hover:text-white transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/send" className="text-sm text-primary-100 hover:text-white transition-colors">
                  {t('nav.send')}
                </Link>
              </li>
              <li>
                <Link to="/recipients" className="text-sm text-primary-100 hover:text-white transition-colors">
                  {t('nav.recipients')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Countries */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.countries')}</h3>
            <ul className="space-y-2">
              <li className="text-sm text-primary-100">Cameroon</li>
              <li className="text-sm text-primary-100">Ghana</li>
              <li className="text-sm text-primary-100">Nigeria</li>
              <li className="text-sm text-primary-100">Kenya</li>
              <li className="text-sm text-primary-100">South Africa</li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.contactUs')}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-primary-100" />
                <a href="mailto:info@yumvi-pay.com" className="text-sm text-primary-100 hover:text-white transition-colors">
                  info@yumvi-pay.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-primary-100" />
                <a href="tel:+1234567890" className="text-sm text-primary-100 hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className={cn(
          "mt-8 pt-6 border-t border-primary-400/30",
          "flex flex-col md:flex-row justify-between items-center"
        )}>
          <p className="text-sm text-primary-100 mb-4 md:mb-0">
            &copy; {currentYear} {t('app.name')}. {t('footer.allRightsReserved')}
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-xs text-primary-100 hover:text-white transition-colors">
              {t('footer.termsOfService')}
            </Link>
            <Link to="/privacy" className="text-xs text-primary-100 hover:text-white transition-colors">
              {t('footer.privacyPolicy')}
            </Link>
            <Link to="/admin" className="text-xs text-primary-100 hover:text-white transition-colors">
              {t('footer.adminPanel')}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative diagonal element */}
      <div className="absolute top-0 left-0 right-0 h-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-12 bg-primary-50 transform -skew-y-3"></div>
      </div>
    </motion.footer>
  );
};

export default Footer;
