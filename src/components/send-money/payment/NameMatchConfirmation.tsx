
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface NameMatchConfirmationProps {
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  showError?: boolean;
}

const NameMatchConfirmation: React.FC<NameMatchConfirmationProps> = ({
  isChecked,
  onCheckedChange,
  showError = false
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      <div 
        className={`p-4 rounded-xl border transition-all duration-300 ${
          showError 
            ? 'bg-red-50 border-red-200 shadow-sm shadow-red-100' 
            : 'bg-amber-50 border-amber-200 shadow-sm shadow-amber-100'
        }`}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${showError ? 'text-red-500' : 'text-amber-500'} mt-0.5`} />
          <div>
            <p className={`font-medium ${showError ? 'text-red-700' : 'text-amber-800'}`}>
              Confirm recipient details
            </p>
            <p className={`text-sm mt-1 ${showError ? 'text-red-600' : 'text-amber-700'}`}>
              Before proceeding, please verify that you have entered the recipient's name EXACTLY as it appears on their account. Mismatched names may result in failed transfers or funds being sent to the wrong person.
            </p>
            
            <div className="mt-4 flex items-start gap-2">
              <Checkbox 
                id="recipient-confirmation" 
                checked={isChecked} 
                onCheckedChange={onCheckedChange} 
                className={`${
                  showError 
                    ? 'border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white' 
                    : 'border-amber-500 data-[state=checked]:bg-green-500'
                } h-5 w-5`}
              />
              <label 
                htmlFor="recipient-confirmation" 
                className={`text-sm ${showError ? 'font-medium text-red-700' : 'text-amber-800'} cursor-pointer`}
              >
                I confirm that I have verified the recipient's name and details are correct
              </label>
            </div>
            
            {isChecked && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 flex items-center gap-1 text-green-600 text-sm"
              >
                <Check className="h-4 w-4" />
                <span>Details confirmed</span>
              </motion.div>
            )}
            
            {showError && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 font-medium"
              >
                You must confirm that the recipient details are correct to continue
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NameMatchConfirmation;
