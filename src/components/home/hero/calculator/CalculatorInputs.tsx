
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import CurrencySelector from '@/components/calculator/currency-selector/CurrencySelector';

interface CalculatorInputsProps {
  sendAmount: string;
  setSendAmount: (value: string) => void;
  receiveAmount: string;
  sourceCurrency: string;
  setSourceCurrency: (currency: string) => void;
  targetCurrency: string;
  setTargetCurrency: (currency: string) => void;
  sourceCurrencies: string[];
  targetCurrencies: string[];
  itemVariants: any;
}

const CalculatorInputs: React.FC<CalculatorInputsProps> = ({
  sendAmount,
  setSendAmount,
  receiveAmount,
  sourceCurrency,
  setSourceCurrency,
  targetCurrency,
  setTargetCurrency,
  sourceCurrencies,
  targetCurrencies,
  itemVariants
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      <motion.div variants={itemVariants} className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">You Send</label>
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
        <label className="block text-sm font-medium text-gray-700">They Receive</label>
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
  );
};

export default CalculatorInputs;
