
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import MobileAppLayout from '@/components/MobileAppLayout';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import ComingSoonMessage from '@/components/send-money/payment/ComingSoonMessage';
import { useToast } from '@/components/ui/use-toast';

const countries = {
  cameroon: {
    name: 'Cameroon',
    code: 'CM',
    capital: 'Yaoundé',
    currency: 'CFA Franc (XAF)',
    languages: 'French, English',
    paymentMethods: ['MTN Mobile Money', 'Orange Money', 'Express Union', 'Bank Transfer'],
    flag: '🇨🇲',
    description: 'Cameroon, often referred to as "Africa in miniature," offers diverse landscapes from beaches to mountains, with rich culture and wildlife.',
    available: true
  },
  senegal: {
    name: 'Senegal',
    code: 'SN',
    capital: 'Dakar',
    currency: 'CFA Franc (XOF)',
    languages: 'French',
    paymentMethods: ['Orange Money', 'Wave', 'Free Money', 'Bank Transfer'],
    flag: '🇸🇳',
    description: 'Senegal, known for its vibrant culture and hospitality (Teranga), features beautiful coastlines, historical sites, and a strong musical tradition.',
    available: false
  },
  nigeria: {
    name: 'Nigeria',
    code: 'NG',
    capital: 'Abuja',
    currency: 'Naira (NGN)',
    languages: 'English',
    paymentMethods: ['Bank Transfer', 'Flutterwave', 'Paystack', 'OPay'],
    flag: '🇳🇬',
    description: 'Nigeria, Africa\'s most populous country, has a dynamic economy, diverse cultures, and is known for its film industry (Nollywood) and music scene.',
    available: false
  },
  ghana: {
    name: 'Ghana',
    code: 'GH',
    capital: 'Accra',
    currency: 'Ghanaian Cedi (GHS)',
    languages: 'English',
    paymentMethods: ['MTN Mobile Money', 'Vodafone Cash', 'Bank Transfer'],
    flag: '🇬🇭',
    description: 'Ghana, known for its stability and friendly people, offers rich history, beautiful beaches, and vibrant markets. It was the first sub-Saharan African nation to gain independence.',
    available: false
  },
  kenya: {
    name: 'Kenya',
    code: 'KE',
    capital: 'Nairobi',
    currency: 'Kenyan Shilling (KES)',
    languages: 'Swahili, English',
    paymentMethods: ['M-Pesa', 'Airtel Money', 'Bank Transfer'],
    flag: '🇰🇪',
    description: 'Kenya features stunning wildlife, the Great Rift Valley, and beautiful beaches. It\'s known for safaris, marathon runners, and mobile payment innovation.',
    available: false
  }
};

const CountryPage: React.FC = () => {
  const { countryId } = useParams<{ countryId: string }>();
  const { t } = useLocale();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showComingSoon, setShowComingSoon] = useState(false);
  
  const country = countryId && countries[countryId as keyof typeof countries];
  
  if (!country) {
    return (
      <MobileAppLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Country Not Found</h1>
          <p className="mb-6">We couldn't find information about this country.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </MobileAppLayout>
    );
  }
  
  const handleSendMoney = () => {
    if (country.available) {
      // For Cameroon, navigate to send money flow
      // First, set up transaction data in localStorage
      const transactionData = {
        targetCountry: country.code,
        amount: 100, // Default amount
        sourceCurrency: 'USD',
        targetCurrency: country.currency.split(' ')[1].replace('(', '').replace(')', ''),
        exchangeRate: country.code === 'CM' ? 607.4330 : 600, // Example rate
      };
      
      localStorage.setItem('pendingTransaction', JSON.stringify(transactionData));
      navigate('/send');
    } else {
      // For other countries, show coming soon message
      setShowComingSoon(true);
      toast({
        title: "Coming Soon",
        description: `Money transfers to ${country.name} will be available soon!`,
        duration: 5000,
      });
    }
  };
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>{country.name} | {t('app.name')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{country.flag}</span>
            <h1 className="text-3xl font-bold text-primary-800">{country.name}</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Country Information</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">Country Code:</div>
                    <div className="font-medium">{country.code}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">Capital:</div>
                    <div className="font-medium">{country.capital}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">Currency:</div>
                    <div className="font-medium">{country.currency}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">Languages:</div>
                    <div className="font-medium">{country.languages}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">About {country.name}</h2>
                <p className="text-gray-700 leading-relaxed">{country.description}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Available Payment Methods</h2>
                <ul className="space-y-2">
                  {country.paymentMethods.map((method, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-500" />
                      <span>{method}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-primary-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Send Money to {country.name}</h2>
                <p className="text-gray-700 mb-4">
                  Start sending money to {country.name} today with our fast, secure, and affordable service.
                </p>
                <Button className="w-full" onClick={handleSendMoney}>Send Money Now</Button>
                {showComingSoon && !country.available && (
                  <ComingSoonMessage message={`Money transfers to ${country.name} will be available soon! We're working on expanding our service.`} />
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-10 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-4">Frequently Asked Questions About Sending Money to {country.name}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-primary-600">How long does it take to send money to {country.name}?</h3>
                <p className="text-gray-600">Most transfers to {country.name} are completed within minutes, but it may take up to 24 hours depending on the payment method.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-primary-600">What are the fees for sending money to {country.name}?</h3>
                <p className="text-gray-600">Our fees are transparent and competitive. They vary based on the amount you send and the payment method you choose.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-primary-600">Do I need an account to send money to {country.name}?</h3>
                <p className="text-gray-600">Yes, you'll need to create an account with Yumvi-Pay to send money to {country.name}. The registration process is quick and easy.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MobileAppLayout>
  );
};

export default CountryPage;
