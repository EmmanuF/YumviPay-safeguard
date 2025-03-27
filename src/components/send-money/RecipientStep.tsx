import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { User, Phone, Info, Users, Star, StarOff, Globe, HelpCircle, Check, AlertCircle, Contact } from 'lucide-react';
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CountrySelector } from '@/components/country-selector';
import { useCountries } from '@/hooks/useCountries';
import NameMatchConfirmation from '@/components/send-money/payment/NameMatchConfirmation';
import { Button } from '@/components/ui/button';
import { importContacts, Contact as ContactType } from '@/services/contacts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
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
  const { getCountryByCode } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState(transactionData?.targetCountry || 'CM');
  const [showNameMatchError, setShowNameMatchError] = useState(false);
  const [showContactsDialog, setShowContactsDialog] = useState(false);
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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
          return `${base} ${rest.substring(0, 2)} ${rest.substring(2, 4)} ${rest.substring(4, 6)} ${rest.substring(6)}`;
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

  const form = useForm<z.infer<typeof formSchema>>({
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (contact.phoneNumber && contact.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  const isFormValid = form.formState.isValid;
  
  useEffect(() => {
    console.log("Form state updated:", { 
      isValid: form.formState.isValid, 
      isDirty: form.formState.isDirty,
      errors: form.formState.errors
    });
  }, [form.formState.isValid, form.formState.isDirty, form.formState.errors]);

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
    switch (countryCode) {
      case 'CM': return "+237 6XX XXX XXX";
      case 'US': return "+1 (XXX) XXX-XXXX";
      case 'GB': return "+44 XXXX XXXXXX";
      case 'NG': return "+234 XXX XXX XXXX";
      case 'GH': return "+233 XX XXX XXXX";
      case 'ZA': return "+27 XX XXX XXXX";
      default: return "+XXX XXX XXX XXX";
    }
  };

  const getPopularProviders = (countryCode: string) => {
    switch (countryCode) {
      case 'CM': return "MTN, Orange";
      case 'US': return "AT&T, Verizon, T-Mobile";
      case 'GB': return "Vodafone, EE, O2";
      case 'NG': return "MTN, Airtel, Glo";
      case 'GH': return "MTN, Vodafone, AirtelTigo";
      case 'ZA': return "Vodacom, MTN, Cell C";
      default: return "Multiple providers";
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
        <Card className="glass-effect border-primary-100/30 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <motion.h2 
              className="text-2xl font-bold text-center text-gradient-primary mb-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            >
              Who are you sending to?
            </motion.h2>
            <motion.p 
              className="text-center text-muted-foreground mb-8"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
            >
              Enter details for your recipient
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="mb-6 flex justify-center"
            >
              <Button 
                variant="outline" 
                onClick={handleLoadContacts}
                className="flex items-center gap-2 w-full mb-4"
                size="lg"
              >
                <Users className="h-5 w-5 text-primary" />
                <span>Select from Contacts</span>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mb-6 bg-white backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 relative z-20"
            >
              <div className="flex items-center mb-3">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-primary-600 font-medium text-base">Recipient's Country</h3>
              </div>
              
              <div className="mt-2">
                <CountrySelector
                  label="Select Country"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  type="receive"
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <Info className="h-4 w-4 mr-1 text-primary-400" />
                  Using {getCountryName(selectedCountry)} phone number format
                </p>
              </div>
            </motion.div>

            <Form {...form}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <motion.div
                      variants={itemVariants}
                      className="card-hover transform transition-all duration-200 hover:translate-y-[-2px]"
                    >
                      <FormItem className="bg-white backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-300/30 via-primary-500/50 to-primary-300/30"></div>
                        
                        <FormLabel className="flex items-center text-primary-600 font-medium text-base mb-2">
                          <div className="bg-primary-50 p-1.5 rounded-full mr-2">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          Recipient Name <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        
                        <FormDescription className="text-sm text-gray-600 ml-9 mb-3">
                          Enter the full name as it appears on their government ID
                        </FormDescription>
                        
                        <FormControl>
                          <div className="relative mt-1">
                            <Input 
                              placeholder="e.g. John Doe" 
                              className="pl-4 form-control-modern h-12 text-base bg-white border-primary-100/50 focus-visible:ring-primary-400/30 transition-all duration-200"
                              {...field} 
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-help">
                                    <HelpCircle className="h-4 w-4" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs bg-white p-3 shadow-lg border border-gray-100">
                                  <p className="text-xs">
                                    For security and compliance reasons, the recipient's name must match their official ID exactly.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </FormControl>
                        
                        {form.formState.errors.recipientName && (
                          <div className="mt-2 text-sm text-red-500 flex items-center">
                            <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                            <FormMessage className="ml-0" />
                          </div>
                        )}
                      </FormItem>
                    </motion.div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipientContact"
                  render={({ field }) => (
                    <motion.div
                      variants={itemVariants}
                      className="card-hover transform transition-all duration-200 hover:translate-y-[-2px]"
                    >
                      <FormItem className="bg-white backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary-300/30 via-secondary-500/50 to-secondary-300/30"></div>
                        
                        <FormLabel className="flex items-center text-primary-600 font-medium text-base mb-2">
                          <div className="bg-secondary-50 p-1.5 rounded-full mr-2">
                            <Phone className="h-4 w-4 text-secondary-600" />
                          </div>
                          Phone Number <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        
                        <FormDescription className="text-sm text-gray-600 ml-9 mb-3 space-y-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span>Format:</span>
                            <Badge variant="outline" className="text-xs font-normal bg-primary-50/80 border-primary-100">
                              {getPhoneNumberPlaceholder(selectedCountry)}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span>Popular providers:</span>
                            <Badge variant="outline" className="text-xs font-normal bg-secondary-50/50 border-secondary-100">
                              {getPopularProviders(selectedCountry)}
                            </Badge>
                          </div>
                        </FormDescription>
                        
                        <FormControl>
                          <div className="relative mt-1">
                            <Input 
                              placeholder={getPhoneNumberPlaceholder(selectedCountry)} 
                              className="pl-4 form-control-modern h-12 text-base bg-white border-secondary-100/50 focus-visible:ring-secondary-400/30 transition-all duration-200"
                              {...field} 
                              onChange={(e) => {
                                const formatted = formatPhoneNumber(e.target.value, selectedCountry);
                                field.onChange(formatted);
                              }}
                            />
                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-secondary-500 transition-colors">
                                  <Info className="h-4 w-4" />
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-4 bg-white shadow-lg border border-gray-100" align="end">
                                <div className="space-y-3">
                                  <h4 className="font-medium text-gray-800 flex items-center">
                                    <Phone className="h-4 w-4 mr-2 text-secondary-500" />
                                    Phone Number Format
                                  </h4>
                                  <p className="text-xs text-gray-600">
                                    Enter the recipient's phone number with country code. This number will receive transaction notifications and may be used for verification.
                                  </p>
                                  <div className="text-xs p-3 bg-secondary-50/50 rounded-lg border border-secondary-100/50">
                                    <div className="font-medium mb-2 text-secondary-700">For {getCountryName(selectedCountry)}:</div>
                                    <ul className="list-disc list-inside pl-2 space-y-1.5 text-gray-700">
                                      <li>Country code: <span className="font-medium">{getCountryCallingCode(selectedCountry)}</span></li>
                                      <li>Format: <span className="font-medium">{getPhoneNumberPlaceholder(selectedCountry)}</span></li>
                                      <li>Example: <span className="font-medium">{getPhoneNumberPlaceholder(selectedCountry).replace(/X/g, '9')}</span></li>
                                    </ul>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormControl>
                        
                        {form.formState.errors.recipientContact && (
                          <div className="mt-2 text-sm text-red-500 flex items-center">
                            <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                            <FormMessage className="ml-0" />
                          </div>
                        )}
                      </FormItem>
                    </motion.div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmRecipientContact"
                  render={({ field }) => (
                    <motion.div
                      variants={itemVariants}
                      className="card-hover transform transition-all duration-200 hover:translate-y-[-2px]"
                    >
                      <FormItem className="bg-white backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary-300/30 via-secondary-500/50 to-secondary-300/30"></div>
                        
                        <FormLabel className="flex items-center text-primary-600 font-medium text-base mb-2">
                          <div className="bg-secondary-50 p-1.5 rounded-full mr-2">
                            <Phone className="h-4 w-4 text-secondary-600" />
                          </div>
                          Confirm Phone Number <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        
                        <FormDescription className="text-sm text-gray-600 ml-9 mb-3">
                          Please enter the phone number again to confirm
                        </FormDescription>
                        
                        <FormControl>
                          <div className="relative mt-1">
                            <Input 
                              placeholder={getPhoneNumberPlaceholder(selectedCountry)} 
                              className="pl-4 form-control-modern h-12 text-base bg-white border-secondary-100/50 focus-visible:ring-secondary-400/30 transition-all duration-200"
                              {...field} 
                              onChange={(e) => {
                                const formatted = formatPhoneNumber(e.target.value, selectedCountry);
                                field.onChange(formatted);
                              }}
                            />
                          </div>
                        </FormControl>
                        
                        {form.formState.errors.confirmRecipientContact && (
                          <div className="mt-2 text-sm text-red-500 flex items-center">
                            <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                            <FormMessage className="ml-0" />
                          </div>
                        )}
                      </FormItem>
                    </motion.div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="saveToFavorites"
                  render={({ field }) => (
                    <motion.div
                      variants={itemVariants}
                      className="card-hover"
                      whileHover={{ scale: 1.02 }}
                    >
                      <FormItem className="bg-white backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-yellow-50 p-2 rounded-full mr-3">
                            {field.value ? (
                              <Star className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <StarOff className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <FormLabel className="text-primary-600 font-medium text-base">Save to Favorites</FormLabel>
                            <FormDescription className="text-xs text-gray-500">
                              Add this recipient to your frequent contacts for faster transfers
                            </FormDescription>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-yellow-500"
                          />
                        </FormControl>
                      </FormItem>
                    </motion.div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nameMatchConfirmed"
                  render={({ field }) => (
                    <motion.div
                      variants={itemVariants}
                      className="mt-6"
                    >
                      <NameMatchConfirmation
                        isChecked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) setShowNameMatchError(false);
                        }}
                        showError={showNameMatchError}
                      />
                      {form.formState.errors.nameMatchConfirmed && (
                        <p className="text-xs text-red-500 mt-1 ml-7">
                          {form.formState.errors.nameMatchConfirmed.message}
                        </p>
                      )}
                    </motion.div>
                  )}
                />

                {isFormValid && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <Alert className="bg-green-50 border-green-200 text-green-800 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400/30 via-green-500 to-green-400/30"></div>
                      
                      <AlertDescription className="flex items-center pt-1">
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        All information looks good! You can proceed to the next step.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <PaymentStepNavigation 
                  onNext={handleNextClick}
                  onBack={handleBackClick}
                  isNextDisabled={!isFormValid}
                  isSubmitting={false}
                />
              </div>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showContactsDialog} onOpenChange={setShowContactsDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-center">Select a Contact</DialogTitle>
          </DialogHeader>
          
          <div className="mb-4">
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          {isLoadingContacts ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ScrollArea className="max-h-[50vh] pr-4">
              {filteredContacts.length > 0 ? (
                <div className="space-y-3">
                  {filteredContacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      className="p-3 border border-gray-100 rounded-lg hover:bg-primary-50 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-100 rounded-full p-2">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          {contact.phoneNumber && (
                            <p className="text-sm text-gray-500">{contact.phoneNumber}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-500">No contacts found</p>
                </div>
              )}
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default RecipientStep;
