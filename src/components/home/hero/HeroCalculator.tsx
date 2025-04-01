
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocale } from '@/contexts/LocaleContext';
import { useExchangeRateCalculator } from '@/hooks/useExchangeRateCalculator';
import { CalculatorInputs, ExchangeRateInfo, SendButton } from './calculator';

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
    isLoadingRate,
    lastRateUpdate,
    refreshRate,
    rateLimitReached
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
      
      <CalculatorInputs
        sendAmount={sendAmount}
        setSendAmount={setSendAmount}
        receiveAmount={receiveAmount}
        sourceCurrency={sourceCurrency}
        setSourceCurrency={setSourceCurrency}
        targetCurrency={targetCurrency}
        setTargetCurrency={setTargetCurrency}
        sourceCurrencies={sourceCurrencies}
        targetCurrencies={targetCurrencies}
        itemVariants={itemVariants}
      />
      
      <SendButton
        handleContinue={handleContinue}
        itemVariants={itemVariants}
      />
      
      <ExchangeRateInfo
        isLoadingRate={isLoadingRate}
        sourceCurrency={sourceCurrency}
        exchangeRate={exchangeRate}
        targetCurrency={targetCurrency}
        refreshRate={refreshRate}
        lastRateUpdate={lastRateUpdate}
        itemVariants={itemVariants}
        rateLimitReached={rateLimitReached}
      />
    </motion.div>
  );
};

export default HeroCalculator;
