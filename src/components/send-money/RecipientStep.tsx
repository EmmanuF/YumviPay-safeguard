
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { User, Phone, Info } from 'lucide-react';
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
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    updateTransactionData({
      recipientName: values.recipientName,
      recipientContact: values.recipientContact,
      recipient: values.recipientContact,
      saveToFavorites: values.saveToFavorites
    });
    onNext();
  };

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

  // Add console logging to debug button clicks
  const handleBackClick = () => {
    console.log("Back button clicked in RecipientStep");
    onBack();
  };

  const handleNextClick = () => {
    console.log("Next button clicked in RecipientStep");
    form.handleSubmit(onSubmit)();
  };

  const isFormValid = form.formState.isValid;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg border border-secondary-100/30">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-center text-indigo-800 mb-6">
              Who are you sending to?
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Choose a recipient or add a new one
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <FormLabel className="flex items-center text-indigo-600 font-medium">
                        <User className="h-4 w-4 mr-2" />
                        Recipient Name <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Full name of recipient" 
                            className="pl-3 form-control-modern"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500 ml-6">
                        Enter the full name as it appears on their ID.
                      </FormDescription>
                      <FormMessage className="text-sm text-red-500 ml-6" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipientContact"
                  render={({ field }) => (
                    <FormItem className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <FormLabel className="flex items-center text-indigo-600 font-medium">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone Number <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="+237 6XX XXX XXX" 
                            className="pl-3 form-control-modern"
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
                      <FormDescription className="text-xs text-gray-500 ml-6">
                        Must include country code (+237 for Cameroon)
                      </FormDescription>
                      <FormMessage className="text-sm text-red-500 ml-6" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="saveToFavorites"
                  render={({ field }) => (
                    <FormItem className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                      <div>
                        <FormLabel className="text-indigo-600 font-medium">Save to Favorites</FormLabel>
                        <FormDescription className="text-xs text-gray-500">
                          Add this recipient to your frequent contacts
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <PaymentStepNavigation 
                  onNext={handleNextClick}
                  onBack={handleBackClick}
                  isNextDisabled={!isFormValid}
                  isSubmitting={false}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default RecipientStep;
