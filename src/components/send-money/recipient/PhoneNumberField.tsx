
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Info, AlertCircle } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";

interface PhoneNumberFieldProps {
  fieldName: string;
  label: string;
  description?: string;
  selectedCountry: string;
  getCountryName: (code: string) => string;
  getPhoneNumberPlaceholder: (countryCode: string) => string;
  getPhoneMaxLength: (countryCode: string) => number;
  getCountryCallingCode: (countryCode: string) => string;
  formatPhoneNumber: (value: string, countryCode: string) => string;
  showPopover?: boolean;
}

export const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  fieldName,
  label,
  description,
  selectedCountry,
  getCountryName,
  getPhoneNumberPlaceholder,
  getPhoneMaxLength,
  getCountryCallingCode,
  formatPhoneNumber,
  showPopover = true
}) => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name={fieldName}
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
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary-300/30 via-secondary-500/50 to-secondary-300/30"></div>
            
            <FormLabel className="flex items-center text-primary-600 font-medium text-base mb-2">
              <div className="bg-secondary-50 p-1.5 rounded-full mr-2">
                <Phone className="h-4 w-4 text-secondary-600" />
              </div>
              {label} <span className="text-red-500 ml-1">*</span>
            </FormLabel>
            
            {description && (
              <div className="text-sm text-gray-600 ml-9 mb-3">
                {description}
              </div>
            )}
            
            <FormControl>
              <div className="relative mt-1">
                <Input 
                  placeholder={selectedCountry === 'CM' ? "+237 6" : getPhoneNumberPlaceholder(selectedCountry)}
                  className="pl-4 form-control-modern h-12 text-base bg-white border-secondary-100/50 focus-visible:ring-secondary-400/30 transition-all duration-200"
                  maxLength={getPhoneMaxLength(selectedCountry)}
                  {...field} 
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value, selectedCountry);
                    field.onChange(formatted);
                  }}
                />
                
                {showPopover && (
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
                          This number will receive transaction notifications and may be used for verification.
                        </p>
                        <div className="text-xs p-3 bg-secondary-50/50 rounded-lg border border-secondary-100/50">
                          <div className="font-medium mb-2 text-secondary-700">For {getCountryName(selectedCountry)}:</div>
                          <ul className="list-disc list-inside pl-2 space-y-1.5 text-gray-700">
                            <li>Country code: <span className="font-medium">{getCountryCallingCode(selectedCountry)}</span></li>
                            <li>Example: <span className="font-medium">{getPhoneNumberPlaceholder(selectedCountry).replace(/X/g, '9')}</span></li>
                          </ul>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </FormControl>
            
            {form.formState.errors[fieldName] && (
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
