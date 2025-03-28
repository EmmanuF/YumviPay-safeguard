
import React from 'react';
import { Star, StarOff } from 'lucide-react';
import { FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import PreferenceToggle from '../payment/PreferenceToggle';

export const FavoritesToggle: React.FC = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="saveToFavorites"
      render={({ field }) => (
        <FormItem>
          <PreferenceToggle
            title="Save to Favorites"
            description="Add this recipient to your frequent contacts for faster transfers"
            checked={field.value}
            onChange={field.onChange}
            icon={field.value ? 
              <Star className="h-5 w-5 text-yellow-500" /> : 
              <StarOff className="h-5 w-5 text-gray-400" />
            }
            accentColor="yellow"
          />
        </FormItem>
      )}
    />
  );
};
