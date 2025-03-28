
import React from 'react';
import { motion } from 'framer-motion';
import { FormProvider } from "react-hook-form";
import { RecipientNameField } from './RecipientNameField';
import { PhoneNumberField } from './PhoneNumberField';
import { FavoritesToggle } from './FavoritesToggle';
import { ValidationSuccessAlert } from './ValidationSuccessAlert';
import NameMatchConfirmation from '@/components/send-money/payment/NameMatchConfirmation';
import { useIsMobile } from '@/hooks/use-mobile';

interface RecipientFormProps {
  form: any;
  selectedCountry: string;
  showNameMatchError: boolean;
  setShowNameMatchError: (show: boolean) => void;
  getCountryName: (code: string) => string;
  getPhoneNumberPlaceholder: (countryCode: string) => string;
  getPhoneMaxLength: (countryCode: string) => number;
  getCountryCallingCode: (countryCode: string) => string;
  formatPhoneNumber: (value: string, countryCode: string) => string;
}

const RecipientForm: React.FC<RecipientFormProps> = ({
  form,
  selectedCountry,
  showNameMatchError,
  setShowNameMatchError,
  getCountryName,
  getPhoneNumberPlaceholder,
  getPhoneMaxLength,
  getCountryCallingCode,
  formatPhoneNumber
}) => {
  const isFormValid = form.formState.isValid;
  const isMobile = useIsMobile();

  return (
    <FormProvider {...form}>
      <div className={`space-y-6 ${isMobile ? 'px-4' : ''}`}>
        <RecipientNameField />

        <PhoneNumberField 
          fieldName="recipientContact"
          label="Phone Number"
          selectedCountry={selectedCountry}
          getCountryName={getCountryName}
          getPhoneNumberPlaceholder={getPhoneNumberPlaceholder}
          getPhoneMaxLength={getPhoneMaxLength}
          getCountryCallingCode={getCountryCallingCode}
          formatPhoneNumber={formatPhoneNumber}
        />

        <PhoneNumberField 
          fieldName="confirmRecipientContact"
          label="Confirm Phone Number"
          description="Please enter the phone number again to confirm"
          selectedCountry={selectedCountry}
          getCountryName={getCountryName}
          getPhoneNumberPlaceholder={getPhoneNumberPlaceholder}
          getPhoneMaxLength={getPhoneMaxLength}
          getCountryCallingCode={getCountryCallingCode}
          formatPhoneNumber={formatPhoneNumber}
          showPopover={false}
        />

        <FavoritesToggle />

        <div className="mt-6">
          <NameMatchConfirmation
            isChecked={form.watch('nameMatchConfirmed')}
            onCheckedChange={(checked) => {
              form.setValue('nameMatchConfirmed', checked, { shouldValidate: true });
              if (checked) setShowNameMatchError(false);
            }}
            showError={showNameMatchError}
          />
          {form.formState.errors.nameMatchConfirmed && (
            <p className="text-xs text-red-500 mt-1 ml-7">
              {form.formState.errors.nameMatchConfirmed.message}
            </p>
          )}
        </div>

        {isFormValid && <ValidationSuccessAlert />}
      </div>
    </FormProvider>
  );
};

export default RecipientForm;
