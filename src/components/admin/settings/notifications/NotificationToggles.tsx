
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';

interface NotificationTogglesProps {
  form: UseFormReturn<any>;
}

const NotificationToggles: React.FC<NotificationTogglesProps> = ({ form }) => {
  return (
    <div className="grid gap-6">
      <FormField
        control={form.control}
        name="emailNotifications"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Email Notifications</FormLabel>
              <FormDescription>
                Receive notifications via email
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="transactionAlerts"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Transaction Alerts</FormLabel>
              <FormDescription>
                Get notified about new and important transactions
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="securityAlerts"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Security Alerts</FormLabel>
              <FormDescription>
                Get notified about security-related events
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="marketingEmails"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Marketing Emails</FormLabel>
              <FormDescription>
                Receive marketing and promotional emails
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default NotificationToggles;
