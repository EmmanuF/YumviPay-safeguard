
import React, { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, SendHorizontal } from 'lucide-react';

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
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary-300" />
          {t('footer.newsletter')}
        </h3>
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
          className="bg-white border-gray-200 w-full hover:border-primary-300 focus:border-primary-300 transition-colors"
          required
        />
        <Button 
          type="submit" 
          className="bg-primary-600 hover:bg-primary-500 w-full transition-all duration-300 group"
        >
          {t('footer.newsletter.button')}
          <SendHorizontal className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSubscription;
