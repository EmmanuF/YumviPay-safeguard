
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface RecipientStepProps {
  transactionData: {
    recipient: string | null;
    recipientName?: string;
  };
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const RecipientStep: React.FC<RecipientStepProps> = ({
  transactionData,
  updateTransactionData,
  onNext,
  onBack
}) => {
  const navigate = useNavigate();
  
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

  const handleSelectFromSaved = () => {
    navigate('/recipients');
  };

  return (
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
          value={transactionData.recipient || ''}
          onChange={(e) => updateTransactionData({ recipient: e.target.value })}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Label htmlFor="recipientName" className="text-sm font-medium mb-1.5 block">
          Recipient's Name
        </Label>
        <Input
          id="recipientName"
          type="text"
          placeholder="Enter recipient's name"
          className="text-base"
          value={transactionData.recipientName || ''}
          onChange={(e) => updateTransactionData({ recipientName: e.target.value })}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleSelectFromSaved}
        >
          <UsersRound className="h-4 w-4" />
          Select from saved recipients
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="pt-4 flex space-x-3">
        <Button 
          variant="outline"
          onClick={onBack} 
          className="w-1/2" 
          size="lg"
        >
          Back
        </Button>
        <Button 
          onClick={onNext} 
          className="w-1/2" 
          size="lg"
          disabled={!transactionData.recipient}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default RecipientStep;
