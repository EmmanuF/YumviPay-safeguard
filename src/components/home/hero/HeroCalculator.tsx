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
  
  // Use the transaction continue hook to properly handle the transaction flow
  const { handleContinue, isProcessing } = useTransactionContinue({
    sendAmount,
    receiveAmount,
    sourceCurrency,
    targetCurrency,
    exchangeRate,
    onContinue: () => {
      console.log("Transaction continue handler called");
      // If user is logged in, go directly to send page
      // otherwise go to signin with redirect
      if (isLoggedIn) {
        navigate('/send');
      } else {
        navigate('/signin', { state: { redirectTo: '/send' } });
      }
    }
  });
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <motion.h2 
        variants={itemVariants}
        className="text-2xl font-bold mb-6"
      >
        Calculate Your Transfer
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">You Send</label>
          <Input
            type="number"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="100"
          />
          <div className="p-3 border rounded-md flex items-center space-x-2">
            <img 
              src="https://flagcdn.com/w40/us.png" 
              alt="US Flag" 
              className="w-5 h-3.5 object-cover"
            />
            <span>United States (USD)</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">They Receive</label>
          <Input
            type="text"
            value={receiveAmount}
            readOnly
            className="w-full p-3 border rounded-md bg-gray-50"
          />
          <div className="p-3 border rounded-md flex items-center space-x-2">
            <img 
              src="https://flagcdn.com/w40/cm.png" 
              alt="Cameroon Flag" 
              className="w-5 h-3.5 object-cover"
            />
            <span>Cameroon (XAF)</span>
          </div>
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants} className="mb-4">
        <Button 
          onClick={handleContinue}
          disabled={isProcessing}
          className="w-full bg-primary hover:bg-primary-600 py-6 flex items-center justify-center"
        >
          <span className="mr-2">Send Now</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="text-center text-sm text-gray-600"
      >
        Exchange Rate: 1 {sourceCurrency} = {exchangeRate.toFixed(4)} {targetCurrency}
      </motion.div>
    </motion.div>
  );
};

export default HeroCalculator;
