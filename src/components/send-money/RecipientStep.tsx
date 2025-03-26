
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, User, Users, Contact2, Phone, Search, ChevronRight } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRecipients } from '@/hooks/useRecipients';
import { toggleFavorite } from '@/services/recipients';
import { Badge } from '@/components/ui/badge';
import FavoriteRecipients from './payment/FavoriteRecipients';
import RecipientCard from './recipient/RecipientCard';
import PaymentStepNavigation from './payment/PaymentStepNavigation';

interface RecipientStepProps {
  transactionData: any;
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
  const { recipients, loading } = useRecipients();
  const [searchTerm, setSearchTerm] = useState('');
  const [manualRecipient, setManualRecipient] = useState({
    name: '',
    phone: ''
  });
  const [activeTab, setActiveTab] = useState('favorites');
  const [validPhone, setValidPhone] = useState(false);
  
  // Effects to initialize manual form from transaction data
  useEffect(() => {
    if (transactionData.recipientName) {
      setManualRecipient(prev => ({
        ...prev,
        name: transactionData.recipientName || ''
      }));
    }
    
    if (transactionData.recipient) {
      setManualRecipient(prev => ({
        ...prev,
        phone: transactionData.recipient || ''
      }));
    }
  }, [transactionData.recipientName, transactionData.recipient]);
  
  // Filtered recipients based on search term
  const filteredRecipients = recipients.filter(recipient => 
    recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.contact.includes(searchTerm)
  );
  
  // Sort favorites first
  const sortedRecipients = [...filteredRecipients].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });
  
  // Get favorite recipients
  const favoriteRecipients = recipients.filter(recipient => recipient.isFavorite);
  
  const handleContactSelect = (contact: string, name: string, id: string, country?: string) => {
    updateTransactionData({
      recipient: contact,
      recipientName: name,
      recipientId: id,
      recipientCountry: country || 'CM'
    });
  };
  
  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await toggleFavorite(id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualRecipient(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate phone for Cameroon format
    if (name === 'phone') {
      const isValid = /^(\+237|237)?[6-9][0-9]{8}$/.test(value);
      setValidPhone(isValid);
    }
  };
  
  const handleManualSubmit = () => {
    updateTransactionData({
      recipient: manualRecipient.phone,
      recipientName: manualRecipient.name,
      recipientId: null,
      recipientCountry: 'CM'
    });
    onNext();
  };
  
  // Check if form is valid
  const isFormValid = 
    manualRecipient.name.trim().length >= 3 && 
    validPhone;
  
  const isNextDisabled = !(
    (transactionData.recipient && transactionData.recipientName) || 
    isFormValid
  );
  
  // Animation variants
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
      className="space-y-4"
    >
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Who are you sending to?</CardTitle>
            <CardDescription>Select a recipient or enter details manually</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="favorites" className="relative">
                  Favorites
                  {favoriteRecipients.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {favoriteRecipients.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
              </TabsList>
              
              <TabsContent value="favorites" className="mt-0">
                {favoriteRecipients.length > 0 ? (
                  <div className="space-y-3">
                    {favoriteRecipients.map(recipient => (
                      <RecipientCard
                        key={recipient.id}
                        recipient={recipient}
                        isSelected={transactionData.recipient === recipient.contact}
                        onSelect={handleContactSelect}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-muted-foreground">No favorite recipients yet</p>
                    <p className="text-sm text-muted-foreground/70">
                      Add favorites from your contacts tab
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="contacts" className="mt-0">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {loading ? (
                  <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading contacts...</p>
                  </div>
                ) : sortedRecipients.length > 0 ? (
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {sortedRecipients.map(recipient => (
                      <RecipientCard
                        key={recipient.id}
                        recipient={recipient}
                        isSelected={transactionData.recipient === recipient.contact}
                        onSelect={handleContactSelect}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-muted-foreground">No contacts found</p>
                    {searchTerm ? (
                      <p className="text-sm text-muted-foreground/70">Try a different search term</p>
                    ) : (
                      <p className="text-sm text-muted-foreground/70">Add contacts to get started</p>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="new" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Recipient Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter recipient's name"
                      value={manualRecipient.name}
                      onChange={handleManualInput}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+237 6XX XXX XXX"
                        value={manualRecipient.phone}
                        onChange={handleManualInput}
                        className={validPhone ? "pr-10 border-green-500 focus-visible:ring-green-500" : "pr-10"}
                      />
                      {validPhone && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter a valid Cameroon mobile number
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Navigation */}
      <motion.div variants={itemVariants} className="mt-4">
        <PaymentStepNavigation 
          onNext={activeTab === 'new' ? handleManualSubmit : onNext}
          onBack={onBack}
          isNextDisabled={isNextDisabled}
          isSubmitting={false}
        />
      </motion.div>
    </motion.div>
  );
};

export default RecipientStep;
