
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import CountrySelector from '@/components/CountrySelector';

interface AmountStepProps {
  amount: string;
  setAmount: (amount: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  onNext: () => void;
}

const AmountStep: React.FC<AmountStepProps> = ({
  amount,
  setAmount,
  selectedCountry,
  setSelectedCountry,
  onNext,
}) => {
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
          label="Select destination country"
          value={selectedCountry}
          onChange={setSelectedCountry}
          type="receive"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="pt-4">
        <Button 
          onClick={onNext} 
          className="w-full" 
          size="lg"
          disabled={!amount || !selectedCountry}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AmountStep;
