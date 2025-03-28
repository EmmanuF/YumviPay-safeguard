
import React, { useState } from 'react';
import { RepeatIcon, ChevronDown, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import PreferenceToggle from './PreferenceToggle';

interface RecurringPaymentToggleProps {
  isRecurring: boolean;
  frequency: string;
  onRecurringChange: (isRecurring: boolean, frequency: string) => void;
}

const RecurringPaymentToggle: React.FC<RecurringPaymentToggleProps> = ({
  isRecurring,
  frequency,
  onRecurringChange
}) => {
  const [isExpanded, setIsExpanded] = useState(isRecurring);

  const handleRecurringToggle = (checked: boolean) => {
    setIsExpanded(checked);
    onRecurringChange(checked, checked ? frequency : 'monthly');
  };

  const handleFrequencyChange = (value: string) => {
    onRecurringChange(isRecurring, value);
  };

  return (
    <div className="mt-4">
      <PreferenceToggle
        title="Make this a recurring payment"
        description="Schedule automatic payments"
        checked={isRecurring}
        onChange={handleRecurringToggle}
        icon={<RepeatIcon className="h-5 w-5 text-primary-600" />}
        accentColor="primary"
      />

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-primary-50/60 backdrop-blur-sm rounded-xl p-5 border border-primary-100/60 mt-3"
          >
            <h4 className="font-medium text-primary-700 mb-3 flex items-center">
              <ChevronDown className="h-4 w-4 mr-1 text-primary" />
              Payment Frequency
            </h4>
            
            <Select 
              value={frequency} 
              onValueChange={handleFrequencyChange}
            >
              <SelectTrigger className="w-full bg-white/80 border-primary-200/60 focus:ring-primary-500/30">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Every 3 Months</SelectItem>
              </SelectContent>
            </Select>
            
            <p className="text-sm text-gray-600 mt-3 bg-white/40 p-3 rounded-lg border border-primary-100/20">
              <Info className="h-4 w-4 inline-block mr-1 text-primary-400" />
              You can cancel recurring payments anytime from your transaction history.
              The payment will be processed automatically on the same day each period.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecurringPaymentToggle;
