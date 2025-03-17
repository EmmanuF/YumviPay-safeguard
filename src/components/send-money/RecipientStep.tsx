
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useRecipients } from '@/hooks/useRecipients';
import { Avatar } from '@/components/ui/avatar';
import CountrySelector from '@/components/CountrySelector';
import { formatPhoneNumber } from '@/utils/formatters/phoneFormatters';

export interface RecipientStepProps {
  transactionData: {
    amount: number;
    sourceCurrency: string;
    targetCurrency: string;
    convertedAmount: number;
    recipient: string | null;
    recipientName?: string;
    recipientCountry?: string;
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
  const { recipients, loading, toggleFavorite, updateLastUsed } = useRecipients();
  const [phoneInput, setPhoneInput] = useState(transactionData.recipient || '');
  const [recipientCountry, setRecipientCountry] = useState(transactionData.recipientCountry || 'CM');
  
  // Update transactionData when phone or country changes
  useEffect(() => {
    if (phoneInput) {
      const formattedNumber = formatPhoneNumber(phoneInput.replace(/\s/g, ''), recipientCountry);
      updateTransactionData({ recipient: formattedNumber });
    }
  }, [phoneInput, recipientCountry, updateTransactionData]);
  
  // Update the phone input when recipient country changes to reformat
  useEffect(() => {
    if (transactionData.recipient) {
      const unformattedNumber = transactionData.recipient.replace(/\s/g, '');
      const reformattedNumber = formatPhoneNumber(unformattedNumber, recipientCountry);
      updateTransactionData({ recipient: reformattedNumber, recipientCountry });
    }
  }, [recipientCountry, updateTransactionData]);
  
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

  // Filter favorites and recent recipients
  const favoriteRecipients = recipients
    .filter(r => r.isFavorite)
    .sort((a, b) => {
      const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
      const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
      return dateB - dateA;
    });
  
  const recentRecipients = recipients
    .filter(r => !r.isFavorite)
    .sort((a, b) => {
      const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
      const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const handleSelectRecipient = async (contact: string, name: string, recipientId: string, country: string = 'CM') => {
    // Update the last used timestamp
    await updateLastUsed(recipientId);
    
    // Update recipient country
    setRecipientCountry(country);
    
    updateTransactionData({ 
      recipient: contact,
      recipientName: name,
      recipientCountry: country
    });
  };

  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await toggleFavorite(id);
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneInput(value);
  };

  const handleCountryChange = (countryCode: string) => {
    setRecipientCountry(countryCode);
    updateTransactionData({ recipientCountry: countryCode });
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
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <motion.div variants={itemVariants} className="space-y-2">
            {loading ? (
              <div className="text-center py-8">Loading recipients...</div>
            ) : recipients && recipients.length > 0 ? (
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {recipients.map((recipient) => (
                  <Card 
                    key={recipient.id}
                    className={`p-3 cursor-pointer transition-all ${
                      transactionData.recipient === recipient.contact ? 
                      'border-primary bg-primary/5' : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectRecipient(recipient.contact, recipient.name, recipient.id, recipient.country)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-primary/10 text-primary">
                          <span>{recipient.name[0]}</span>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{recipient.name}</h4>
                          <p className="text-sm text-gray-500">{recipient.contact}</p>
                        </div>
                      </div>
                      <Star 
                        className={`h-5 w-5 ${recipient.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        onClick={(e) => handleToggleFavorite(e, recipient.id)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recipients found. Add your first recipient.
              </div>
            )}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4">
          <motion.div variants={itemVariants} className="space-y-2">
            {loading ? (
              <div className="text-center py-8">Loading favorites...</div>
            ) : favoriteRecipients.length > 0 ? (
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {favoriteRecipients.map((recipient) => (
                  <Card 
                    key={recipient.id}
                    className={`p-3 cursor-pointer transition-all ${
                      transactionData.recipient === recipient.contact ? 
                      'border-primary bg-primary/5' : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectRecipient(recipient.contact, recipient.name, recipient.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-primary/10 text-primary">
                          <span>{recipient.name[0]}</span>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{recipient.name}</h4>
                          <p className="text-sm text-gray-500">{recipient.contact}</p>
                        </div>
                      </div>
                      <Star 
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        onClick={(e) => handleToggleFavorite(e, recipient.id)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No favorite recipients yet. Mark recipients as favorites to see them here.
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
            />
            {transactionData.recipient && (
              <p className="text-xs text-gray-500 mt-1">
                Formatted: {transactionData.recipient}
              </p>
            )}
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
