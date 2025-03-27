
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { User, Phone, Info, Users, Star, StarOff } from 'lucide-react';
import PaymentStepNavigation from './payment/PaymentStepNavigation';

const formSchema = z.object({
  recipientName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  recipientContact: z.string().min(6, { message: "Valid phone number required." })
    .regex(/^\+?[0-9\s\-\(\)]{6,20}$/, { 
      message: "Phone must include country code (e.g., +237)." 
    }),
  saveToFavorites: z.boolean().default(false)
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
  const formatPhoneNumber = (value: string) => {
    let cleaned = value.replace(/[^\d+]/g, '');
    
    if (cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.substring(1).replace(/\+/g, '');
    }
    
    if (cleaned.startsWith('+') && cleaned.length > 3) {
      return `${cleaned.substring(0, 4)} ${cleaned.substring(4).replace(/(.{3})/g, '$1 ').trim()}`;
    }
    
    return cleaned;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: transactionData?.recipientName || "",
      recipientContact: transactionData?.recipientContact || transactionData?.recipient || "",
      saveToFavorites: transactionData?.saveToFavorites || false
    },
    mode: "onChange" // This ensures validation runs on every change
  });

  // Submit handler with enhanced logging
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with values:", values);
    updateTransactionData({
      recipientName: values.recipientName,
      recipientContact: values.recipientContact,
      recipient: values.recipientContact,
      saveToFavorites: values.saveToFavorites
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-20" // Added padding at bottom to ensure buttons are visible
    >
      <motion.div variants={itemVariants}>
        <Card className="glass-effect border-primary-100/30 shadow-lg">
          <CardContent className="p-6">
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
              Choose a recipient or add a new one
            </motion.p>

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
                        <FormControl>
                          <div className="relative mt-2">
                            <Input 
                              placeholder="Full name of recipient" 
                              className="pl-3 form-control-modern h-12 text-base bg-white/80 backdrop-blur-sm border-primary-100/50 focus-visible:ring-primary-400/30"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500 ml-6 mt-2">
                          Enter the full name as it appears on their ID.
                        </FormDescription>
                        <FormMessage className="text-sm text-red-500 ml-6 mt-1" />
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
                        <FormControl>
                          <div className="relative mt-2">
                            <Input 
                              placeholder="+237 6XX XXX XXX" 
                              className="pl-3 form-control-modern h-12 text-base bg-white/80 backdrop-blur-sm border-primary-100/50 focus-visible:ring-primary-400/30"
                              {...field} 
                              onChange={(e) => {
                                const formatted = formatPhoneNumber(e.target.value);
                                field.onChange(formatted);
                              }}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <Info className="h-4 w-4" />
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500 ml-6 mt-2">
                          Must include country code (+237 for Cameroon)
                        </FormDescription>
                        <FormMessage className="text-sm text-red-500 ml-6 mt-1" />
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
                              Add this recipient to your frequent contacts
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
