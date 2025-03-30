
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLocale } from '@/contexts/LocaleContext';

interface SendButtonProps {
  handleContinue: () => void;
  itemVariants: any;
}

const SendButton: React.FC<SendButtonProps> = ({ handleContinue, itemVariants }) => {
  const { t } = useLocale();
  
  return (
    <motion.div variants={itemVariants} className="mb-5">
      <Button 
        onClick={handleContinue}
        className="w-full bg-primary hover:bg-primary-600 py-6 flex items-center justify-center shadow-md shadow-primary-200/40 transition-all hover:shadow-lg hover:shadow-primary-300/40 rounded-xl"
      >
        <span className="mr-2">{t('hero.calculator.button')}</span>
        <ArrowRight className="h-5 w-5" />
      </Button>
    </motion.div>
  );
};

export default SendButton;
