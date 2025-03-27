
import React from 'react';
import { motion } from 'framer-motion';
import { User, HelpCircle, AlertCircle } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFormContext } from "react-hook-form";

const RecipientNameField: React.FC = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="recipientName"
      render={({ field }) => (
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { 
              y: 0, 
              opacity: 1,
              transition: { type: 'spring', stiffness: 300, damping: 24 }
            }
          }}
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
  );
};

export default RecipientNameField;
