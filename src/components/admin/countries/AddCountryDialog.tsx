
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, 
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminCountry } from '@/services/admin/adminCountryService';

const formSchema = z.object({
  code: z.string().length(2, { message: "Country code must be exactly 2 characters" }).toUpperCase(),
  name: z.string().min(1, { message: "Country name is required" }),
  currency: z.string().min(1, { message: "Currency code is required" }),
  currency_symbol: z.string().min(1, { message: "Currency symbol is required" }),
  flag_emoji: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddCountryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<AdminCountry>) => Promise<void>;
}

const AddCountryDialog: React.FC<AddCountryDialogProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      currency: '',
      currency_symbol: '',
      flag_emoji: '',
    }
  });
  
  const handleSubmit = async (data: FormValues) => {
    await onSubmit(data);
    form.reset();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Country</DialogTitle>
          <DialogDescription>
            Enter the details for the new country
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="US" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      maxLength={2}
                    />
                  </FormControl>
                  <FormDescription>
                    2-letter ISO country code (e.g., US, GB, FR)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Name</FormLabel>
                  <FormControl>
                    <Input placeholder="United States" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="USD" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      maxLength={3}
                    />
                  </FormControl>
                  <FormDescription>
                    3-letter ISO currency code (e.g., USD, EUR, GBP)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency_symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="$" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="flag_emoji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flag Emoji</FormLabel>
                  <FormControl>
                    <Input placeholder="🇺🇸" {...field} />
                  </FormControl>
                  <FormDescription>
                    Country flag emoji (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Country</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCountryDialog;
