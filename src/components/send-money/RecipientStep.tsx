import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useRecipients } from '@/hooks/useRecipients';

export interface RecipientStepProps {
  transactionData: {
    amount: number;
    sourceCurrency: string;
    targetCurrency: string;
    convertedAmount: number;
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
  const { toast } = useToast();
  const { recipients, isLoading } = useRecipients();
  
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

  const handleSelectRecipient = (contact: string, name: string) => {
    updateTransactionData({ 
      recipient: contact,
      recipientName: name
    });
  };

  const handleNewRecipient = () => {
    if (!transactionData.recipient || !transactionData.recipientName) {
      toast({
        title: "Missing information",
        description: "Please enter both name and contact information",
        variant: "destructive",
      });
      return;
    }
    
    onNext();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="recent">Recent Recipients</TabsTrigger>
          <TabsTrigger value="new">New Recipient</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-4">
          <motion.div variants={itemVariants} className="space-y-2">
            {isLoading ? (
              <div className="text-center py-8">Loading recipients...</div>
            ) : recipients && recipients.length > 0 ? (
              recipients.map((recipient) => (
                <Card 
                  key={recipient.id}
                  className={`p-4 cursor-pointer transition-all ${
                    transactionData.recipient === recipient.contact ? 
                    'border-primary-500 bg-primary-50' : 'hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectRecipient(recipient.contact, recipient.name)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{recipient.name}</h4>
                      <p className="text-sm text-gray-500">{recipient.contact}</p>
                    </div>
                    {recipient.isFavorite && (
                      <span className="text-yellow-500">★</span>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent recipients found
              </div>
            )}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          <motion.div variants={itemVariants}>
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
            <Label htmlFor="recipient" className="text-sm font-medium mb-1.5 block">
              Mobile Number
            </Label>
            <Input
              id="recipient"
              placeholder="Enter recipient's mobile number"
              value={transactionData.recipient || ''}
              onChange={(e) => updateTransactionData({ recipient: e.target.value })}
            />
          </motion.div>
        </TabsContent>
      </Tabs>

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
