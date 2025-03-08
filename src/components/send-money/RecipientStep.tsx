
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface RecipientStepProps {
  recipient: string;
  setRecipient: (recipient: string) => void;
  onNext: () => void;
}

const RecipientStep: React.FC<RecipientStepProps> = ({
  recipient,
  setRecipient,
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
          onClick={onNext} 
          className="w-full" 
          size="lg"
          disabled={!recipient}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default RecipientStep;
