
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

export default NewsletterSubscription;
