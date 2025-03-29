
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import { useRecipientStep } from '@/hooks/useRecipientStep';
import RecipientForm from './recipient/RecipientForm';
import { CountrySection, ContactsButton, ContactsDialog } from './recipient';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  const {
    form,
    selectedCountry,
    showNameMatchError,
    setShowNameMatchError,
    showContactsDialog,
    setShowContactsDialog,
    contacts,
    isLoadingContacts,
    isFormValid,
    handleLoadContacts,
    handleContactSelect,
    handleBackClick,
    handleNextClick,
    handleCountryChange,
    getCountryName,
    getPhoneNumberPlaceholder,
    getPhoneMaxLength,
    getCountryCallingCode,
    formatPhoneNumber
  } = useRecipientStep({
    transactionData,
    updateTransactionData,
    onNext,
    onBack
  });

  // Debug validation state
  useEffect(() => {
    const subscription = form.watch(() => {
      console.log("Form errors:", form.formState.errors);
      console.log("Form valid:", form.formState.isValid);
      console.log("Form values:", form.getValues());
      
      // Check if phone numbers match
      const phone = form.getValues('recipientContact');
      const confirmPhone = form.getValues('confirmRecipientContact');
      if (phone && confirmPhone && phone !== confirmPhone) {
        console.log("Phone numbers don't match");
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const handleStepNextClick = () => {
    const values = form.getValues();
    
    // First check if the name is confirmed
    if (!values.nameMatchConfirmed) {
      setShowNameMatchError(true);
      toast({
        title: "Confirmation required",
        description: "Please confirm that recipient details are correct",
        variant: "destructive"
      });
      return;
    }
    
    // Check if phone numbers match
    if (values.recipientContact !== values.confirmRecipientContact) {
      form.setError('confirmRecipientContact', { 
        type: 'manual', 
        message: 'Phone numbers do not match'
      });
      toast({
        title: "Phone numbers don't match",
        description: "Please ensure both phone numbers are identical",
        variant: "destructive"
      });
      return;
    }
    
    // Trigger validation and proceed if valid
    form.trigger().then(isValid => {
      if (isValid) {
        handleNextClick();
      } else {
        toast({
          title: "Missing or invalid information",
          description: "Please check all fields and try again",
          variant: "destructive"
        });
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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
      className="space-y-6 pb-20"
    >
      <motion.div variants={itemVariants}>
        <Card className="soft-gradient-card border-primary-100/30 shadow-md">
          <CardHeader className="section-header">
            <CardTitle className="text-xl text-gray-800">Who are you sending to?</CardTitle>
            <CardDescription className="text-gray-500">Enter details for your recipient</CardDescription>
            <ContactsButton onClick={handleLoadContacts} className="mt-3" />
          </CardHeader>

          <CardContent className="section-body">
            <CountrySection 
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
              getCountryName={getCountryName}
            />

            <RecipientForm 
              form={form}
              selectedCountry={selectedCountry}
              showNameMatchError={showNameMatchError}
              setShowNameMatchError={setShowNameMatchError}
              getCountryName={getCountryName}
              getPhoneNumberPlaceholder={getPhoneNumberPlaceholder}
              getPhoneMaxLength={getPhoneMaxLength}
              getCountryCallingCode={getCountryCallingCode}
              formatPhoneNumber={formatPhoneNumber}
            />
          </CardContent>
          <CardFooter className="section-footer">
            <PaymentStepNavigation 
              onNext={handleStepNextClick}
              onBack={handleBackClick}
              isNextDisabled={false}
              isSubmitting={false}
            />
          </CardFooter>
        </Card>
      </motion.div>

      <ContactsDialog 
        open={showContactsDialog}
        onOpenChange={setShowContactsDialog}
        contacts={contacts}
        isLoading={isLoadingContacts}
        onSelect={handleContactSelect}
      />
    </motion.div>
  );
};

export default RecipientStep;
