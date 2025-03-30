
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

const ExchangeRateCalculatorStub: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleClick = () => {
    setIsSubmitting(true);
    
    // Simulate loading state for better UX
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/signup');
    }, 500);
  };

  const handleMobileClick = () => {
    toast({
      title: t('notifications.mobileApp'),
      description: t('notifications.downloadApp'),
      variant: "info",
    });
  };
  
  return (
    <div className={`p-6 rounded-xl bg-white shadow-sm ${isMobile ? 'mx-2' : ''}`}>
      <h3 className="text-2xl font-bold mb-6">{t('hero.calculator.title')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t('hero.calculator.youSend')}</label>
          <div className="p-3 border rounded-md bg-white">
            100
          </div>
          <div className="p-3 border rounded-md flex items-center space-x-2">
            <img 
              src="https://flagcdn.com/w40/us.png" 
              alt="US Flag" 
              className="w-5 h-3.5 object-cover"
            />
            <span>{t('country.us')} (USD)</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t('hero.calculator.theyReceive')}</label>
          <div className="p-3 border rounded-md bg-gray-50">
            60,743.30
          </div>
          <div className="p-3 border rounded-md flex items-center space-x-2">
            <img 
              src="https://flagcdn.com/w40/cm.png" 
              alt="Cameroon Flag" 
              className="w-5 h-3.5 object-cover"
            />
            <span>{t('country.cameroon')} (XAF)</span>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-primary-600 py-6 flex items-center justify-center mb-4"
        onClick={handleClick}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            {t('common.loading')}
          </>
        ) : (
          <>
            <span className="mr-2">{t('hero.calculator.button')}</span>
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>
      
      {isMobile && (
        <Button 
          className="w-full bg-secondary hover:bg-secondary-600 py-6 flex items-center justify-center mb-4"
          onClick={handleMobileClick}
          variant="secondary"
        >
          {t('hero.calculator.mobileApp')}
        </Button>
      )}
      
      <div className="text-center text-sm text-gray-600">
        {t('hero.calculator.rate', {from: "USD", to: "607.4330", toCurrency: "XAF"})}
      </div>
    </div>
  );
};

export default ExchangeRateCalculatorStub;
