
import React from 'react';
import { Helmet } from 'react-helmet-async';
import MobileAppLayout from '@/components/MobileAppLayout';
import { useLocale } from '@/contexts/LocaleContext';
import ContactPageTitle from '@/components/support/ContactPageTitle';
import ContactForm from '@/components/support/ContactForm';
import ContactInfo from '@/components/support/ContactInfo';

const Contact: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Contact Us | {t('app.name')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <ContactPageTitle />
        
        <div className="grid md:grid-cols-2 gap-8">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </MobileAppLayout>
  );
};

export default Contact;
