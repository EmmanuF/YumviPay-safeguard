
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExchangeRateCalculator } from '@/hooks/useExchangeRateCalculator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionContinue } from '@/hooks/exchange-rate/useTransactionContinue';

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
  const { 
    sendAmount, 
    setSendAmount, 
    receiveAmount, 
    exchangeRate 
  } = useExchangeRateCalculator();
  
  // Fixed values for the MVP version focused on Cameroon
  const sourceCurrency = "USD";
  const targetCurrency = "XAF";
  
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
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative glass-effect p-6 md:p-8 border border-white/30 rounded-xl shadow-lg backdrop-blur-lg"
    >
      <motion.h2 
        variants={itemVariants}
        className="text-2xl font-bold mb-6 text-gradient-primary"
      >
        Calculate Your Transfer
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <motion.div variants={itemVariants} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">You Send</label>
          <Input
            type="number"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            className="w-full p-3 border rounded-md bg-white/80 shadow-sm focus:ring-2 focus:ring-primary-300"
            placeholder="100"
          />
          <div className="p-3 border rounded-md flex items-center space-x-2 bg-white/70 shadow-sm">
            <img 
              src="https://flagcdn.com/w40/us.png" 
              alt="US Flag" 
              className="w-5 h-3.5 object-cover"
            />
            <span>United States (USD)</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">They Receive</label>
          <Input
            type="text"
            value={receiveAmount}
            readOnly
            className="w-full p-3 border rounded-md bg-white/60 shadow-sm"
          />
          <div className="p-3 border rounded-md flex items-center space-x-2 bg-white/70 shadow-sm">
            <img 
              src="https://flagcdn.com/w40/cm.png" 
              alt="Cameroon Flag" 
              className="w-5 h-3.5 object-cover"
            />
            <span>Cameroon (XAF)</span>
          </div>
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants} className="mb-5">
        <Button 
          onClick={handleContinue}
          className="w-full bg-primary hover:bg-primary-600 py-6 flex items-center justify-center shadow-md shadow-primary-200/40 transition-all hover:shadow-lg hover:shadow-primary-300/40"
        >
          <span className="mr-2">Send Now</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="text-center text-sm text-gray-600 font-medium bg-white/50 rounded-md py-2 px-4"
      >
        Exchange Rate: 1 {sourceCurrency} = {exchangeRate.toFixed(4)} {targetCurrency}
      </motion.div>
    </motion.div>
  );
};

export default HeroCalculator;
