
import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface EmailConfigurationProps {
  form: UseFormReturn<any>;
  isEmailTestLoading: boolean;
  onTestEmail: () => void;
}

const EmailConfiguration: React.FC<EmailConfigurationProps> = ({
  form,
  isEmailTestLoading,
  onTestEmail
}) => {
  return (
    <div className="space-y-4 pt-4">
      <h3 className="text-lg font-medium">Email Configuration</h3>
      
      <FormField
        control={form.control}
        name="emailFrom"
        render={({ field }) => (
          <FormItem>
            <FormLabel>From Email Address</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              Email address used as the sender for all notifications
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="emailService"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Service</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select email service" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="smtp">SMTP</SelectItem>
                <SelectItem value="sendgrid">SendGrid</SelectItem>
                <SelectItem value="mailgun">Mailgun</SelectItem>
                <SelectItem value="ses">Amazon SES</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Email service used for sending notifications
            </FormDescription>
          </FormItem>
        )}
      />
      
      <Button 
        type="button" 
        variant="outline"
        onClick={onTestEmail}
        disabled={isEmailTestLoading}
      >
        {isEmailTestLoading ? (
          <>
            <Mail className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Test Email
          </>
        )}
      </Button>
    </div>
  );
};

export default EmailConfiguration;
