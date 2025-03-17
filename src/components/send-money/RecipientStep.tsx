
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Info, AlertCircle, Check, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useRecipients } from '@/hooks/useRecipients';
import { Avatar } from '@/components/ui/avatar';
import CountrySelector from '@/components/CountrySelector';
import { formatPhoneNumber, isValidPhoneNumber } from '@/utils/formatters/phoneFormatters';
import { importContacts, Contact } from '@/services/contacts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

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
  const [phoneInput, setPhoneInput] = useState(transactionData.recipient || '');
  const [recipientCountry, setRecipientCountry] = useState(transactionData.recipientCountry || 'CM');
  const [isValidNumber, setIsValidNumber] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(false);
  
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
    setRecipientCountry(country);
    setPhoneInput(contact);
    setIsTouched(true);
    
    updateTransactionData({ 
      recipient: contact,
      recipientName: name,
      recipientCountry: country
    });
    
    const isValid = isValidPhoneNumber(contact, country);
    setIsValidNumber(isValid);
  };

  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await toggleFavorite(id);
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneInput(value);
    setIsTouched(true);
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
    
    if (!isValidNumber) {
      toast({
        title: "Invalid phone number",
        description: `Please enter a valid phone number for ${recipientCountry}`,
        variant: "destructive",
      });
      return;
    }
    
    onNext();
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
  
  const handleImportFromContacts = async () => {
    setImportDialogOpen(true);
    setLoadingContacts(true);
    try {
      const importedContacts = await importContacts();
      setContacts(importedContacts);
    } catch (error) {
      console.error('Failed to import contacts:', error);
      toast({
        title: "Import failed",
        description: "Could not access your contacts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingContacts(false);
    }
  };
  
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact === selectedContact ? null : contact);
  };
  
  const handleImportContact = async () => {
    if (!selectedContact) {
      toast({
        title: "No contact selected",
        description: "Please select a contact to import",
        variant: "destructive"
      });
      return;
    }
    
    // Update the transaction data with the selected contact
    const contactPhone = selectedContact.phoneNumber || '';
    const formattedPhone = formatPhoneNumber(contactPhone, recipientCountry);
    updateTransactionData({
      recipient: formattedPhone,
      recipientName: selectedContact.name
    });
    
    // Update local state
    setPhoneInput(formattedPhone);
    setIsTouched(true);
    setIsValidNumber(isValidPhoneNumber(formattedPhone, recipientCountry));
    
    // Also add this contact as a recipient for future use
    try {
      if (selectedContact.name && selectedContact.phoneNumber) {
        await addRecipient({
          name: selectedContact.name,
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
          description: `Successfully added ${selectedContact.name} as a recipient`,
        });
      }
    } catch (error) {
      console.error('Error adding recipient:', error);
    }
    
    setImportDialogOpen(false);
    setSelectedContact(null);
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
            <div className="mb-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleImportFromContacts}
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
          disabled={!transactionData.recipient || !isValidNumber || !transactionData.recipientName}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
      
      {/* Contacts import dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import from Contacts</DialogTitle>
          </DialogHeader>
          
          {loadingContacts ? (
            <div className="flex flex-col justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <span className="text-muted-foreground">Loading contacts...</span>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[50vh] pr-4">
                {contacts.length > 0 ? (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className={`flex items-start space-x-3 p-3 rounded-md cursor-pointer ${
                          selectedContact?.id === contact.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'
                        }`}
                        onClick={() => handleSelectContact(contact)}
                      >
                        <Checkbox 
                          id={`contact-${contact.id}`}
                          checked={selectedContact?.id === contact.id}
                          onCheckedChange={() => handleSelectContact(contact)}
                          className="mt-1"
                        />
                        <div className="grid gap-1 text-left">
                          <label 
                            htmlFor={`contact-${contact.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {contact.name}
                          </label>
                          {contact.phoneNumber && (
                            <p className="text-sm text-muted-foreground">
                              {contact.phoneNumber}
                            </p>
                          )}
                          {contact.email && (
                            <p className="text-sm text-muted-foreground">
                              {contact.email}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-1">No contacts found</p>
                    <p className="text-sm text-muted-foreground">
                      Please add contacts to your device or grant permission to access them
                    </p>
                  </div>
                )}
              </ScrollArea>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleImportContact}
                  disabled={!selectedContact}
                >
                  Import Selected Contact
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default RecipientStep;
