
import React from 'react';
import { motion } from 'framer-motion';
import { Star, StarOff } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

export const FavoritesToggle: React.FC = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="saveToFavorites"
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
                <FormLabel className="text-secondary-700 font-medium text-base">Save to Favorites</FormLabel>
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
  );
};
