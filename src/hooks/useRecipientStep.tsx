
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact as ContactType, importContacts } from '@/services/contacts';
import { useCountries } from '@/hooks/useCountries';
import { toast } from '@/hooks/use-toast';

export const formSchema = z.object({
  recipientName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  recipientContact: z.string().min(6, { message: "Valid phone number required." })
    .regex(/^\+?[0-9\s\-\(\)]{6,20}$/, { 
      message: "Phone must include country code (e.g., +237)." 
    }),
  confirmRecipientContact: z.string().min(6, { message: "Valid phone number required." })
    .regex(/^\+?[0-9\s\-\(\)]{6,20}$/, { 
      message: "Phone must include country code (e.g., +237)." 
    }),
  saveToFavorites: z.boolean().default(false),
  countryCode: z.string().optional(),
  nameMatchConfirmed: z.boolean().default(false)
    .refine(val => val === true, {
      message: "You must confirm the recipient name matches their official ID"
    })
}).refine((data) => {
  const phone1 = data.recipientContact.replace(/\s+/g, '');
  const phone2 = data.confirmRecipientContact.replace(/\s+/g, '');
  return phone1 === phone2;
}, {
  message: "Phone numbers do not match",
  path: ["confirmRecipientContact"]
});

export type RecipientFormValues = z.infer<typeof formSchema>;

interface UseRecipientStepProps {
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const useRecipientStep = ({
  transactionData,
  updateTransactionData,
  onNext,
  onBack
}: UseRecipientStepProps) => {
  const { getCountryByCode } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState(transactionData?.targetCountry || 'CM');
  const [showNameMatchError, setShowNameMatchError] = useState(false);
  const [showContactsDialog, setShowContactsDialog] = useState(false);
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  
  const form = useForm<RecipientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: transactionData?.recipientName || "",
      recipientContact: transactionData?.recipientContact || transactionData?.recipient || "",
      confirmRecipientContact: transactionData?.recipientContact || transactionData?.recipient || "",
      saveToFavorites: transactionData?.saveToFavorites || false,
      countryCode: selectedCountry,
      nameMatchConfirmed: transactionData?.nameMatchConfirmed || false
    },
    mode: "onChange"
  });

  useEffect(() => {
    form.setValue('countryCode', selectedCountry);
  }, [selectedCountry, form]);

  // Format phone number based on country code
  const formatPhoneNumber = (value: string, countryCode: string = 'CM') => {
    let cleaned = value.replace(/[^\d+]/g, '');
    
    if (cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.substring(1).replace(/\+/g, '');
    }
    
    if (!cleaned.startsWith('+')) {
      const countryCallingCode = getCountryCallingCode(countryCode);
      cleaned = countryCallingCode + cleaned;
    }
    
    const formatted = formatByCountry(cleaned, countryCode);
    return formatted;
  };

  const getCountryCallingCode = (countryCode: string) => {
    const callingCodes: Record<string, string> = {
      'CM': '+237',
      'US': '+1',
      'GB': '+44',
      'NG': '+234',
      'KE': '+254',
      'GH': '+233',
      'SN': '+221',
      'CI': '+225',
      'ZA': '+27',
    };
    
    return callingCodes[countryCode] || '+';
  };

  const formatByCountry = (number: string, countryCode: string) => {
    if (!number.startsWith('+')) return number;
    
    const digitsOnly = number.replace(/\s+/g, '');
    
    switch (countryCode) {
      case 'CM': 
        if (digitsOnly.startsWith('+237')) {
          const base = digitsOnly.substring(0, 4);
          const rest = digitsOnly.substring(4);
          if (rest.length <= 2) return `${base} ${rest}`;
          if (rest.length <= 4) return `${base} ${rest.substring(0, 2)} ${rest.substring(2)}`;
          if (rest.length <= 6) return `${base} ${rest.substring(0, 2)} ${rest.substring(2, 4)} ${rest.substring(4)}`;
          if (rest.length <= 9) return `${base} ${rest.substring(0, 2)} ${rest.substring(2, 4)} ${rest.substring(4, 6)} ${rest.substring(6)}`;
          return `${base} ${rest.substring(0, 2)} ${rest.substring(2, 4)} ${rest.substring(4, 6)} ${rest.substring(6, 9)}`;
        }
        break;
      case 'US': 
        if (digitsOnly.startsWith('+1')) {
          const base = digitsOnly.substring(0, 2);
          const rest = digitsOnly.substring(2);
          if (rest.length <= 3) return `${base} (${rest}`;
          if (rest.length <= 6) return `${base} (${rest.substring(0, 3)}) ${rest.substring(3)}`;
          return `${base} (${rest.substring(0, 3)}) ${rest.substring(3, 6)}-${rest.substring(6)}`;
        }
        break;
      case 'GB': 
        if (digitsOnly.startsWith('+44')) {
          const base = digitsOnly.substring(0, 3);
          const rest = digitsOnly.substring(3);
          if (rest.length <= 4) return `${base} ${rest}`;
          return `${base} ${rest.substring(0, 4)} ${rest.substring(4)}`;
        }
        break;
      default:
        const countryCode = digitsOnly.match(/^\+\d{1,3}/)?.[0] || '';
        if (countryCode) {
          const rest = digitsOnly.substring(countryCode.length);
          return rest.length > 0 
            ? `${countryCode} ${rest.replace(/(\d{3})/g, '$1 ').trim()}`
            : countryCode;
        }
    }
    
    return number;
  };

  const onSubmit = (values: RecipientFormValues) => {
    console.log("Form submitted with values:", values);
    updateTransactionData({
      recipientName: values.recipientName,
      recipientContact: values.recipientContact,
      recipient: values.recipientContact,
      saveToFavorites: values.saveToFavorites,
      targetCountry: values.countryCode,
      nameMatchConfirmed: values.nameMatchConfirmed
    });
    
    console.log("Calling onNext() after form submission");
    onNext();
  };

  const handleLoadContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const fetchedContacts = await importContacts();
      setContacts(fetchedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoadingContacts(false);
    }
    setShowContactsDialog(true);
  };

  const handleContactSelect = (contact: ContactType) => {
    if (contact.phoneNumber) {
      const formattedPhone = formatPhoneNumber(contact.phoneNumber, selectedCountry);
      form.setValue('recipientContact', formattedPhone, { shouldValidate: true });
      form.setValue('confirmRecipientContact', formattedPhone, { shouldValidate: true });
    }
    
    if (contact.name) {
      form.setValue('recipientName', contact.name, { shouldValidate: true });
    }
    
    setShowContactsDialog(false);
  };

  const handleBackClick = () => {
    console.log("Back button clicked in RecipientStep with data:", form.getValues());
    onBack();
  };

  const handleNextClick = () => {
    console.log("Next button clicked in RecipientStep with data:", form.getValues());
    
    const nameConfirmed = form.getValues('nameMatchConfirmed');
    if (!nameConfirmed) {
      setShowNameMatchError(true);
      form.setError('nameMatchConfirmed', { 
        type: 'manual', 
        message: 'You must confirm the recipient details are correct'
      });
    }
    
    form.trigger().then(isValid => {
      console.log("Form validation result:", isValid);
      if (isValid) {
        form.handleSubmit(onSubmit)();
      } else {
        console.log("Form validation failed, not submitting");
      }
    });
  };

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    
    const currentPhone = form.getValues('recipientContact');
    if (currentPhone) {
      const formattedPhone = formatPhoneNumber(currentPhone, code);
      form.setValue('recipientContact', formattedPhone, { shouldValidate: true });
    }
  };

  const getCountryName = (code: string) => {
    const country = getCountryByCode(code);
    return country?.name || code;
  };

  const getPhoneNumberPlaceholder = (countryCode: string) => {
    if (countryCode === 'CM') return "+237 6XX XX XX XX";
    
    switch (countryCode) {
      case 'US': return "+1 (XXX) XXX-XXXX";
      case 'GB': return "+44 XXXX XXXXXX";
      case 'NG': return "+234 XXX XXX XXXX";
      case 'GH': return "+233 XX XXX XXXX";
      case 'ZA': return "+27 XX XXX XXXX";
      default: return "+XXX XXX XXX XXX";
    }
  };

  const getPhoneMaxLength = (countryCode: string): number => {
    switch (countryCode) {
      case 'CM': return 19; // +237 6XX XX XX XX (9 digits + spaces + country code)
      case 'US': return 16; // +1 (XXX) XXX-XXXX
      case 'GB': return 16; // +44 XXXX XXXXXX
      case 'NG': return 17; // +234 XXX XXX XXXX
      case 'GH': return 16; // +233 XX XXX XXXX
      case 'ZA': return 16; // +27 XX XXX XXXX
      default: return 20;
    }
  };

  return {
    form,
    selectedCountry,
    showNameMatchError,
    setShowNameMatchError,
    showContactsDialog,
    setShowContactsDialog,
    contacts,
    isLoadingContacts,
    isFormValid: form.formState.isValid,
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
  };
};
