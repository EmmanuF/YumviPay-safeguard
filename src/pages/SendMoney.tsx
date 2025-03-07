
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import CountrySelector from '@/components/CountrySelector';
import PaymentMethodCard from '@/components/PaymentMethodCard';

const SendMoney = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Generate a random transaction ID for demo purposes
      const transactionId = Math.random().toString(36).substring(2, 10);
      navigate(`/transaction/${transactionId}`);
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title={step === 1 ? "Send Money" : step === 2 ? "Recipient" : "Payment Method"} 
        showBackButton={true} 
      />
      
      <div className="flex-1 p-4">
        {step === 1 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Label htmlFor="amount" className="text-sm font-medium mb-1.5 block">Amount to send</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8 text-lg"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="country" className="text-sm font-medium mb-1.5 block">
                Destination Country
              </Label>
              <CountrySelector 
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountry}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <Button 
                onClick={handleNext} 
                className="w-full" 
                size="lg"
                disabled={!amount || !selectedCountry}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Label htmlFor="recipient" className="text-sm font-medium mb-1.5 block">
                Recipient's Mobile Number or Email
              </Label>
              <Input
                id="recipient"
                type="text"
                placeholder="Enter mobile or email"
                className="text-base"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <Button 
                onClick={handleNext} 
                className="w-full" 
                size="lg"
                disabled={!recipient}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <h3 className="text-sm font-medium mb-3">Select Payment Method</h3>
              <div className="space-y-3">
                <PaymentMethodCard
                  name="Credit Card"
                  icon="credit-card"
                  selected={selectedPaymentMethod === 'credit-card'}
                  onClick={() => handlePaymentMethodSelect('credit-card')}
                />
                <PaymentMethodCard
                  name="Bank Transfer"
                  icon="bank"
                  selected={selectedPaymentMethod === 'bank'}
                  onClick={() => handlePaymentMethodSelect('bank')}
                />
                <PaymentMethodCard
                  name="Mobile Money"
                  icon="smartphone"
                  selected={selectedPaymentMethod === 'mobile-money'}
                  onClick={() => handlePaymentMethodSelect('mobile-money')}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-4 bg-primary-50 border-primary-100">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-primary-700">Transaction Summary</h4>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p>Amount: ${amount}</p>
                      <p>Destination: {selectedCountry}</p>
                      <p>Recipient: {recipient}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <Button 
                onClick={handleNext} 
                className="w-full" 
                size="lg"
                disabled={!selectedPaymentMethod}
              >
                Proceed to Payment
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SendMoney;
