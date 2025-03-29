
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const ExchangeRateCalculatorStub: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  
  return (
    <div className="p-6 rounded-xl bg-white">
      <h3 className="text-2xl font-bold mb-6">{t('sendMoney.calculatorTitle')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t('transaction.youSend')}</label>
          <div className="p-3 border rounded-md bg-white">
            100
          </div>
          <div className="p-3 border rounded-md flex items-center space-x-2">
            <img 
              src="https://flagcdn.com/w40/us.png" 
              alt="US Flag" 
              className="w-5 h-3.5 object-cover"
            />
            <span>United States (USD)</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t('transaction.theyReceive')}</label>
          <div className="p-3 border rounded-md bg-gray-50">
            60,743.30
          </div>
          <div className="p-3 border rounded-md flex items-center space-x-2">
            <img 
              src="https://flagcdn.com/w40/cm.png" 
              alt="Cameroon Flag" 
              className="w-5 h-3.5 object-cover"
            />
            <span>Cameroon (XAF)</span>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-primary-600 py-6 flex items-center justify-center mb-4"
        onClick={() => navigate('/signup')}
      >
        <span className="mr-2">{t('actions.sendNow')}</span>
        <ArrowRight className="h-5 w-5" />
      </Button>
      
      <div className="text-center text-sm text-gray-600">
        {t('transaction.exchangeRate')}: 1 USD = 607.4330 XAF
      </div>
    </div>
  );
};

export default ExchangeRateCalculatorStub;
