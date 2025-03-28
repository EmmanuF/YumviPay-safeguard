
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneNumberField, RecipientNameField } from './index';
import NameMatchConfirmation from '../payment/NameMatchConfirmation';

interface RecipientFormProps {
  form: any;
  selectedCountry: any;
  showNameMatchError: boolean;
  setShowNameMatchError: (show: boolean) => void;
  getCountryName: (code: string) => string;
  getPhoneNumberPlaceholder: (code: string) => string;
  getPhoneMaxLength: (code: string) => number;
  getCountryCallingCode: (code: string) => string;
  formatPhoneNumber: (phoneNumber: string, countryCode: string) => string;
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
  const nameMatchConfirmed = form.watch('nameMatchConfirmed') || false;

  const handleNameMatchChange = (checked: boolean) => {
    form.setValue('nameMatchConfirmed', checked, { shouldValidate: true });
    setShowNameMatchError(false);
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form className="space-y-6 mt-6">
          <RecipientNameField />
          
          <PhoneNumberField
            selectedCountry={selectedCountry}
            getPhoneNumberPlaceholder={getPhoneNumberPlaceholder}
            getPhoneMaxLength={getPhoneMaxLength}
            getCountryCallingCode={getCountryCallingCode}
            formatPhoneNumber={formatPhoneNumber}
          />
          
          <NameMatchConfirmation
            isChecked={nameMatchConfirmed}
            onCheckedChange={handleNameMatchChange}
            showError={showNameMatchError}
            variant="recipient"
          />
        </form>
      </Form>
    </FormProvider>
  );
};

export default RecipientForm;
