
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import { useRecipientStep } from '@/hooks/useRecipientStep';
import RecipientForm from './recipient/RecipientForm';
import { CountrySection, ContactsButton, ContactsDialog } from './recipient';

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
              onNext={handleNextClick}
              onBack={handleBackClick}
              isNextDisabled={!isFormValid}
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
