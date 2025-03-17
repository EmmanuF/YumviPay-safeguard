
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-base font-semibold text-primary-800 mb-3">{t('footer.newsletter')}</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder={t('footer.newsletter.placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border-gray-200"
          required
        />
        <Button type="submit" className="bg-primary-600 hover:bg-primary-700 whitespace-nowrap">
          {t('footer.newsletter.button')}
        </Button>
      </div>
    </form>
  );
};

export default NewsletterSubscription;
