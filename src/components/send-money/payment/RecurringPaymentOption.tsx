
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RepeatIcon, CheckCircle2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RecurringPaymentOptionProps {
  transactionData: any;
  onRecurringChange: (isRecurring: boolean, frequency: string) => void;
}

const RecurringPaymentOption: React.FC<RecurringPaymentOptionProps> = ({
  transactionData,
  onRecurringChange
}) => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('monthly');

  const handleRecurringToggle = (checked: boolean) => {
    setIsRecurring(checked);
    onRecurringChange(checked, frequency);
  };

  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
    if (isRecurring) {
      onRecurringChange(isRecurring, value);
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <RepeatIcon className="h-5 w-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-medium">Make this a recurring payment</h3>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Schedule automatic payments to this recipient on a regular basis.
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="recurring-toggle" className="font-medium">
            Recurring Payment
          </Label>
          <Switch
            id="recurring-toggle"
            checked={isRecurring}
            onCheckedChange={handleRecurringToggle}
          />
        </div>

        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isRecurring ? 'auto' : 0,
            opacity: isRecurring ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className={cn(
            "overflow-hidden",
            !isRecurring && "pointer-events-none"
          )}
        >
          <div className="pt-3 border-t">
            <Label htmlFor="frequency-select" className="block mb-2">
              Payment Frequency
            </Label>
            <Select
              value={frequency}
              onValueChange={handleFrequencyChange}
            >
              <SelectTrigger id="frequency-select" className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Every 3 Months</SelectItem>
              </SelectContent>
            </Select>

            {isRecurring && (
              <div className="mt-4 p-3 bg-primary-50 rounded-md flex items-start">
                <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-primary-700">Automatic Payments Scheduled</p>
                  <p className="text-primary-600 mt-1">
                    Your payment will automatically be processed {frequency === 'weekly' ? 'every week' : 
                    frequency === 'biweekly' ? 'every 2 weeks' : 
                    frequency === 'monthly' ? 'every month' : 'every 3 months'} after the initial payment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default RecurringPaymentOption;
