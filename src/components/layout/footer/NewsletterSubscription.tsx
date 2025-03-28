
import React, { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NewsletterSubscription: React.FC = () => {
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-white">{t('footer.newsletter')}</h3>
        <p className="text-sm text-gray-300">
          Stay updated with our latest offers, promotions, and new features.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder={t('footer.newsletter.placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border-gray-200 w-full"
          required
        />
        <Button type="submit" className="bg-primary-600 hover:bg-primary-700 w-full">
          {t('footer.newsletter.button')}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSubscription;
