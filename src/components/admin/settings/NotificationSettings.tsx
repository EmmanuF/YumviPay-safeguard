
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import NotificationToggles from './notifications/NotificationToggles';
import EmailConfiguration from './notifications/EmailConfiguration';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [isEmailTestLoading, setIsEmailTestLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      emailNotifications: true,
      transactionAlerts: true,
      securityAlerts: true,
      marketingEmails: false,
      emailFrom: 'noreply@yumvipay.com',
      emailService: 'smtp'
    }
  });

  const handleSubmit = (data: any) => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const testEmailNotification = () => {
    setIsEmailTestLoading(true);
    setTimeout(() => {
      setIsEmailTestLoading(false);
      toast({
        title: "Test Email Sent",
        description: "A test notification has been sent to your email address.",
      });
    }, 1500);
  };

  return (
    <Card className="border-primary-100/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure system notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <NotificationToggles form={form} />
            <EmailConfiguration 
              form={form}
              isEmailTestLoading={isEmailTestLoading}
              onTestEmail={testEmailNotification}
            />
            
            <div className="flex justify-end pt-2">
              <Button type="submit">
                <Bell className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
