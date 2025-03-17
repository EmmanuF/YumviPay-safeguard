
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useRecipients } from '@/hooks/useRecipients';
import { formatPhoneNumber, isValidPhoneNumber } from '@/utils/formatters/phoneFormatters';
import { Contact } from '@/services/contacts';

import RecipientsList from './recipient/RecipientsList';
import NewRecipientForm from './recipient/NewRecipientForm';
import ContactsImportDialog from './recipient/ContactsImportDialog';

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
  const { recipients, loading, toggleFavorite, updateLastUsed, addRecipient } = useRecipients();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  // Define container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // Filter recipients for different views
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
    await updateLastUsed(recipientId);
    
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

  const handleImportFromContacts = () => {
    setImportDialogOpen(true);
  };
  
  const handleSelectContact = async (contact: Contact) => {
    // Update the transaction data with the selected contact
    const contactPhone = contact.phoneNumber || '';
    const recipientCountry = transactionData.recipientCountry || 'CM';
    const formattedPhone = formatPhoneNumber(contactPhone, recipientCountry);
    
    updateTransactionData({
      recipient: formattedPhone,
      recipientName: contact.name
    });
    
    // Also add this contact as a recipient for future use
    try {
      if (contact.name && contact.phoneNumber) {
        await addRecipient({
          name: contact.name,
          contact: formattedPhone,
          country: recipientCountry,
          isFavorite: false,
          category: 'other',
          lastUsed: new Date(),
          usageCount: 1,
          verified: false,
        });
        
        toast({
          title: "Contact imported",
          description: `Successfully added ${contact.name} as a recipient`,
        });
      }
    } catch (error) {
      console.error('Error adding recipient:', error);
    }
  };
  
  const isValidSubmission = () => {
    if (!transactionData.recipient || !transactionData.recipientName) {
      return false;
    }
    
    const recipientCountry = transactionData.recipientCountry || 'CM';
    return isValidPhoneNumber(transactionData.recipient, recipientCountry);
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
          <RecipientsList
            recipients={recipients}
            loading={loading}
            selectedRecipient={transactionData.recipient}
            onSelectRecipient={handleSelectRecipient}
            onToggleFavorite={handleToggleFavorite}
          />
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4">
          <RecipientsList
            recipients={favoriteRecipients}
            loading={loading}
            selectedRecipient={transactionData.recipient}
            onSelectRecipient={handleSelectRecipient}
            onToggleFavorite={handleToggleFavorite}
          />
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          <NewRecipientForm
            transactionData={transactionData}
            updateTransactionData={updateTransactionData}
            onImportFromContacts={handleImportFromContacts}
          />
        </TabsContent>
      </Tabs>

      <motion.div 
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
        }} 
        className="pt-4 flex space-x-3"
      >
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
          disabled={!isValidSubmission()}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
      
      {/* Contacts import dialog */}
      <ContactsImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSelectContact={handleSelectContact}
      />
    </motion.div>
  );
};

export default RecipientStep;
