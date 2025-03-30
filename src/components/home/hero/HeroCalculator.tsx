
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExchangeRateCalculator } from '@/hooks/useExchangeRateCalculator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocale } from '@/contexts/LocaleContext';
import CurrencySelector from '@/components/calculator/currency-selector/CurrencySelector';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const HeroCalculator: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const isMobile = useIsMobile();
  const { t } = useLocale();
  const { 
    sendAmount, 
    setSendAmount, 
    receiveAmount, 
    exchangeRate,
    sourceCurrency,
    setSourceCurrency,
    targetCurrency,
    setTargetCurrency,
    sourceCurrencies,
    targetCurrencies,
    isLoadingRate
  } = useExchangeRateCalculator();
  
  // Custom handling for "Send Now" button to ensure direct redirection to /send for logged in users
  const handleContinue = () => {
    console.log("Send Now button clicked, isLoggedIn:", isLoggedIn);
    
    try {
      // Store transaction data in localStorage
      const transactionData = {
        amount: parseFloat(sendAmount) || 100,
        sendAmount: sendAmount,
        receiveAmount: receiveAmount,
        sourceCurrency,
        targetCurrency,
        exchangeRate,
        convertedAmount: parseFloat(receiveAmount) || 61000,
        targetCountry: "CM",
      };
      
      localStorage.setItem('pendingTransaction', JSON.stringify(transactionData));
      console.log("Transaction data stored:", transactionData);
      
      // Redirect based on authentication status
      if (isLoggedIn) {
        console.log("User is logged in, redirecting to /send");
        navigate('/send');
      } else {
        console.log("User is not logged in, redirecting to /signin");
        navigate('/signin', { state: { redirectAfterLogin: '/send' } });
      }
    } catch (error) {
      console.error("Error during transaction continuation:", error);
    }
  };
  
  // Enhanced spacing for mobile
  const calculatorPadding = isMobile ? "p-5 md:p-8" : "p-6 md:p-8";
  const calculatorMargin = isMobile ? "mb-5 md:mb-6" : "mb-6";
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`relative glass-effect ${calculatorPadding} border border-white/30 rounded-xl shadow-lg backdrop-blur-lg`}
    >
      <motion.h2 
        variants={itemVariants}
        className={`text-2xl font-bold ${calculatorMargin} text-gradient-primary`}
      >
        {t('hero.calculator.title')}
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <motion.div variants={itemVariants} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">{t('hero.calculator.youSend')}</label>
          <Input
            type="number"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white/80 shadow-sm focus:ring-2 focus:ring-primary-300"
            placeholder="100"
          />
          <div className="p-1 bg-white/70 rounded-lg shadow-sm">
            <CurrencySelector
              label="Source Currency"
              value={sourceCurrency}
              onChange={setSourceCurrency}
              options={sourceCurrencies}
            />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">{t('hero.calculator.theyReceive')}</label>
          <Input
            type="text"
            value={receiveAmount}
            readOnly
            className="w-full p-3 border rounded-lg bg-white/60 shadow-sm"
          />
          <div className="p-1 bg-white/70 rounded-lg shadow-sm">
            <CurrencySelector
              label="Target Currency"
              value={targetCurrency}
              onChange={setTargetCurrency}
              options={targetCurrencies}
            />
          </div>
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants} className="mb-5">
        <Button 
          onClick={handleContinue}
          className="w-full bg-primary hover:bg-primary-600 py-6 flex items-center justify-center shadow-md shadow-primary-200/40 transition-all hover:shadow-lg hover:shadow-primary-300/40 rounded-xl"
        >
          <span className="mr-2">{t('hero.calculator.button')}</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="text-center text-sm text-gray-600 font-medium bg-white/50 rounded-md py-2 px-4 flex items-center justify-center"
      >
        {isLoadingRate ? (
          <span className="flex items-center">
            <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
            {t('hero.calculator.updating_rate')}
          </span>
        ) : (
          t('hero.calculator.rate', {from: sourceCurrency, to: exchangeRate.toFixed(4), toCurrency: targetCurrency})
        )}
      </motion.div>
    </motion.div>
  );
};

export default HeroCalculator;
