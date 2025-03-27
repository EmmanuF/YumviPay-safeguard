
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { User, Phone, Info, Users, Star, StarOff, Globe, HelpCircle, Check } from 'lucide-react';
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CountrySelector } from '@/components/country-selector';
import { useCountries } from '@/hooks/useCountries';

const formSchema = z.object({
  recipientName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  recipientContact: z.string().min(6, { message: "Valid phone number required." })
    .regex(/^\+?[0-9\s\-\(\)]{6,20}$/, { 
      message: "Phone must include country code (e.g., +237)." 
    }),
  saveToFavorites: z.boolean().default(false),
  countryCode: z.string().optional()
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
  
  // Format phone number based on country code
  const formatPhoneNumber = (value: string, countryCode: string = 'CM') => {
    // Strip non-numeric characters except for + at the beginning
    let cleaned = value.replace(/[^\d+]/g, '');
    
    if (cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.substring(1).replace(/\+/g, '');
    }
    
    // If no country code is provided, add the default one
    if (!cleaned.startsWith('+')) {
      // Get country calling code based on country code
      const countryCallingCode = getCountryCallingCode(countryCode);
      cleaned = countryCallingCode + cleaned;
    }
    
    // Format based on country
    const formatted = formatByCountry(cleaned, countryCode);
    return formatted;
  };
  
  // Get country calling code
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
  
  // Format phone number based on country-specific patterns
  const formatByCountry = (number: string, countryCode: string) => {
    // If it doesn't start with +, we can't format it properly
    if (!number.startsWith('+')) return number;
    
    // Remove all spaces first
    const digitsOnly = number.replace(/\s+/g, '');
    
    switch (countryCode) {
      case 'CM': // Cameroon: +237 6XX XX XX XX
        if (digitsOnly.startsWith('+237')) {
          const base = digitsOnly.substring(0, 4); // +237
          const rest = digitsOnly.substring(4);
          if (rest.length <= 2) return `${base} ${rest}`;
          if (rest.length <= 4) return `${base} ${rest.substring(0, 2)} ${rest.substring(2)}`;
          if (rest.length <= 6) return `${base} ${rest.substring(0, 2)} ${rest.substring(2, 4)} ${rest.substring(4)}`;
          return `${base} ${rest.substring(0, 2)} ${rest.substring(2, 4)} ${rest.substring(4, 6)} ${rest.substring(6)}`;
        }
        break;
      case 'US': // USA: +1 (XXX) XXX-XXXX
        if (digitsOnly.startsWith('+1')) {
          const base = digitsOnly.substring(0, 2); // +1
          const rest = digitsOnly.substring(2);
          if (rest.length <= 3) return `${base} (${rest}`;
          if (rest.length <= 6) return `${base} (${rest.substring(0, 3)}) ${rest.substring(3)}`;
          return `${base} (${rest.substring(0, 3)}) ${rest.substring(3, 6)}-${rest.substring(6)}`;
        }
        break;
      case 'GB': // UK: +44 XXXX XXXXXX
        if (digitsOnly.startsWith('+44')) {
          const base = digitsOnly.substring(0, 3); // +44
          const rest = digitsOnly.substring(3);
          if (rest.length <= 4) return `${base} ${rest}`;
          return `${base} ${rest.substring(0, 4)} ${rest.substring(4)}`;
        }
        break;
      default:
        // Generic international format: +XXX XXX XXX XXX
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
      saveToFavorites: transactionData?.saveToFavorites || false,
      countryCode: selectedCountry
    },
    mode: "onChange" // This ensures validation runs on every change
  });

  // Update country code when selected country changes
  useEffect(() => {
    form.setValue('countryCode', selectedCountry);
  }, [selectedCountry, form]);

  // Submit handler with enhanced logging
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with values:", values);
    updateTransactionData({
      recipientName: values.recipientName,
      recipientContact: values.recipientContact,
      recipient: values.recipientContact,
      saveToFavorites: values.saveToFavorites,
      targetCountry: values.countryCode
    });
    
    console.log("Calling onNext() after form submission");
    onNext();
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

  // Enhanced button handlers with detailed logging
  const handleBackClick = () => {
    console.log("Back button clicked in RecipientStep with data:", form.getValues());
    onBack();
  };

  const handleNextClick = () => {
    console.log("Next button clicked in RecipientStep with data:", form.getValues());
    
    // Manually trigger form validation before submission
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
  
  // Log form state changes for debugging
  useEffect(() => {
    console.log("Form state updated:", { 
      isValid: form.formState.isValid, 
      isDirty: form.formState.isDirty,
      errors: form.formState.errors
    });
  }, [form.formState.isValid, form.formState.isDirty, form.formState.errors]);

  // Handle country selection
  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    
    // Update the phone number format if it exists
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

  // Get an example phone number format based on country
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

  // Example method to get popular service providers by country (for helper text)
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
      className="space-y-6 pb-20" // Added padding at bottom to ensure buttons are visible
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

            {/* Country selector */}
            <motion.div
              variants={itemVariants}
              className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80"
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
                      className="card-hover"
                    >
                      <FormItem className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80">
                        <FormLabel className="flex items-center text-primary-600 font-medium text-base">
                          <User className="h-5 w-5 mr-2 text-primary" />
                          Recipient Name <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormDescription className="text-sm text-gray-500 ml-7 mb-2">
                          Enter the full name as it appears on their government ID.
                        </FormDescription>
                        <FormControl>
                          <div className="relative mt-1">
                            <Input 
                              placeholder="e.g. John Doe" 
                              className="pl-3 form-control-modern h-12 text-base bg-white/80 backdrop-blur-sm border-primary-100/50 focus-visible:ring-primary-400/30"
                              {...field} 
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-help">
                                    <HelpCircle className="h-4 w-4" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-xs">
                                    For security and compliance reasons, the recipient's name must match their official ID.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm text-red-500 ml-7 mt-1" />
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
                      className="card-hover"
                    >
                      <FormItem className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80">
                        <FormLabel className="flex items-center text-primary-600 font-medium text-base">
                          <Phone className="h-5 w-5 mr-2 text-primary" />
                          Phone Number <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormDescription className="text-sm text-gray-500 ml-7 mb-2 flex flex-wrap items-center gap-1">
                          <span>Format:</span>
                          <Badge variant="outline" className="text-xs font-normal bg-primary-50">
                            {getPhoneNumberPlaceholder(selectedCountry)}
                          </Badge>
                          <span className="ml-1">Popular providers:</span>
                          <Badge variant="outline" className="text-xs font-normal bg-secondary-50/50">
                            {getPopularProviders(selectedCountry)}
                          </Badge>
                        </FormDescription>
                        <FormControl>
                          <div className="relative mt-1">
                            <Input 
                              placeholder={getPhoneNumberPlaceholder(selectedCountry)} 
                              className="pl-3 form-control-modern h-12 text-base bg-white/80 backdrop-blur-sm border-primary-100/50 focus-visible:ring-primary-400/30"
                              {...field} 
                              onChange={(e) => {
                                const formatted = formatPhoneNumber(e.target.value, selectedCountry);
                                field.onChange(formatted);
                              }}
                            />
                            <Popover>
                              <PopoverTrigger asChild>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                                  <Info className="h-4 w-4" />
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="w-80" align="end">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Phone Number Format</h4>
                                  <p className="text-xs text-gray-600">
                                    Enter the recipient's phone number with country code. This number will receive transaction notifications and may be used for verification.
                                  </p>
                                  <div className="text-xs p-2 bg-primary-50/50 rounded border border-primary-100/50">
                                    <div className="font-medium mb-1">For {getCountryName(selectedCountry)}:</div>
                                    <ul className="list-disc list-inside pl-2 space-y-1">
                                      <li>Country code: {getCountryCallingCode(selectedCountry)}</li>
                                      <li>Format: {getPhoneNumberPlaceholder(selectedCountry)}</li>
                                      <li>Example: {getPhoneNumberPlaceholder(selectedCountry).replace(/X/g, '9')}</li>
                                    </ul>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm text-red-500 ml-7 mt-1" />
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
                      <FormItem className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 flex items-center justify-between">
                        <div className="flex items-center">
                          {field.value ? (
                            <Star className="h-5 w-5 mr-3 text-yellow-500" />
                          ) : (
                            <StarOff className="h-5 w-5 mr-3 text-gray-400" />
                          )}
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
                            className="data-[state=checked]:bg-primary"
                          />
                        </FormControl>
                      </FormItem>
                    </motion.div>
                  )}
                />

                {isFormValid && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                      <AlertDescription className="flex items-center">
                        <Check className="h-4 w-4 mr-2" />
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
    </motion.div>
  );
};

export default RecipientStep;
