
import React, { useState, useEffect } from 'react';
import { Info, AlertCircle, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import CountrySelector from '@/components/CountrySelector';
import { formatPhoneNumber, isValidPhoneNumber } from '@/utils/formatters/phoneFormatters';

interface NewRecipientFormProps {
  transactionData: {
    recipientName?: string;
    recipient: string | null;
    recipientCountry?: string;
  };
  updateTransactionData: (data: Partial<any>) => void;
  onImportFromContacts: () => void;
}

const NewRecipientForm: React.FC<NewRecipientFormProps> = ({
  transactionData,
  updateTransactionData,
  onImportFromContacts,
}) => {
  const [phoneInput, setPhoneInput] = useState(transactionData.recipient || '');
  const [recipientCountry, setRecipientCountry] = useState(transactionData.recipientCountry || 'CM');
  const [isValidNumber, setIsValidNumber] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  
  useEffect(() => {
    if (phoneInput) {
      const formattedNumber = formatPhoneNumber(phoneInput, recipientCountry);
      updateTransactionData({ recipient: formattedNumber });
      const isValid = isValidPhoneNumber(formattedNumber, recipientCountry);
      setIsValidNumber(isValid);
    } else {
      setIsValidNumber(false);
      updateTransactionData({ recipient: null });
    }
  }, [phoneInput, recipientCountry, updateTransactionData]);
  
  useEffect(() => {
    if (transactionData.recipient) {
      const formattedNumber = formatPhoneNumber(transactionData.recipient, recipientCountry);
      updateTransactionData({ recipient: formattedNumber, recipientCountry });
      setIsValidNumber(isValidPhoneNumber(formattedNumber, recipientCountry));
    }
  }, [recipientCountry, updateTransactionData, transactionData.recipient]);

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneInput(value);
    setIsTouched(true);
  };

  const handleCountryChange = (countryCode: string) => {
    setRecipientCountry(countryCode);
    updateTransactionData({ recipientCountry: countryCode });
  };

  const getPhoneInputValidationClass = () => {
    if (!isTouched) return '';
    
    if (phoneInput && isValidNumber) {
      return 'border-green-500 focus:border-green-500 focus:ring-green-500/50';
    } else if (phoneInput) {
      return 'border-red-500 focus:border-red-500 focus:ring-red-500/50';
    }
    
    return '';
  };

  const renderPhoneValidationMessage = () => {
    if (!isTouched || !phoneInput) return null;
    
    if (isValidNumber) {
      return (
        <p className="text-xs text-green-600 mt-1 flex items-center">
          <Check size={14} className="mr-1" />
          Valid phone number format
        </p>
      );
    } else {
      return (
        <p className="text-xs text-red-600 mt-1 flex items-center">
          <AlertCircle size={14} className="mr-1" />
          Please enter a valid phone number for this country
        </p>
      );
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
    <>
      <motion.div variants={itemVariants}>
        <div className="mb-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={onImportFromContacts}
          >
            <Users className="h-4 w-4" />
            Import from Phone Contacts
          </Button>
        </div>
        
        <Label htmlFor="recipientName" className="text-sm font-medium mb-1.5 block">
          Recipient Name
        </Label>
        <Input
          id="recipientName"
          placeholder="Enter recipient's full name"
          value={transactionData.recipientName || ''}
          onChange={(e) => updateTransactionData({ recipientName: e.target.value })}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Label htmlFor="recipientCountry" className="text-sm font-medium mb-1.5 block">
          Recipient Country
        </Label>
        <CountrySelector
          label="Select recipient country"
          value={recipientCountry}
          onChange={handleCountryChange}
          type="receive"
        />
        <div className="mt-1 flex items-start text-xs text-blue-600">
          <Info size={14} className="mr-1 mt-0.5 flex-shrink-0" />
          <span>The phone number format will adjust based on the selected country</span>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Label htmlFor="recipient" className="text-sm font-medium mb-1.5 block">
          Mobile Number
        </Label>
        <Input
          id="recipient"
          placeholder={`Enter number (e.g., ${
            recipientCountry === 'CM' ? '+237 6XX XX XX XX' : 
            recipientCountry === 'NG' ? '+234 8XX XXX XXXX' :
            recipientCountry === 'GH' ? '+233 5X XXX XXXX' :
            '+XXX XX XXX XXXX'
          })`}
          value={phoneInput}
          onChange={handlePhoneInputChange}
          type="tel"
          className={getPhoneInputValidationClass()}
        />
        
        {transactionData.recipient && (
          <div className="mt-1">
            <p className="text-xs text-gray-500">
              Formatted: {transactionData.recipient}
            </p>
            {renderPhoneValidationMessage()}
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-500">
          <p>Requirements:</p>
          <ul className="list-disc pl-4 mt-1">
            {recipientCountry === 'CM' && (
              <>
                <li>Must start with +237</li>
                <li>Followed by 9 digits (usually starting with 6 or 2)</li>
              </>
            )}
            {recipientCountry === 'NG' && (
              <>
                <li>Must start with +234</li>
                <li>Followed by 10 digits (usually starting with 7, 8, or 9)</li>
              </>
            )}
            {recipientCountry === 'GH' && (
              <>
                <li>Must start with +233</li>
                <li>Followed by 9 digits</li>
              </>
            )}
            {!['CM', 'NG', 'GH'].includes(recipientCountry) && (
              <>
                <li>Must start with correct country code</li>
                <li>Followed by required number of digits</li>
              </>
            )}
          </ul>
        </div>
      </motion.div>
    </>
  );
};

export default NewRecipientForm;
