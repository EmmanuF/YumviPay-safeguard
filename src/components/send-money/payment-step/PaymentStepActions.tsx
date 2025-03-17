
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentStepActionsProps {
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  isPaymentMethodSelected: boolean;
}

const PaymentStepActions: React.FC<PaymentStepActionsProps> = ({
  onNext,
  onBack,
  isSubmitting = false,
  isPaymentMethodSelected
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div variants={itemVariants} className="pt-4 flex space-x-3">
      <Button 
        variant="outline"
        onClick={onBack} 
        className="w-1/2" 
        size="lg"
        disabled={isSubmitting}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Button 
        onClick={onNext} 
        className="w-1/2" 
        size="lg"
        disabled={isSubmitting || !isPaymentMethodSelected}
      >
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default PaymentStepActions;
