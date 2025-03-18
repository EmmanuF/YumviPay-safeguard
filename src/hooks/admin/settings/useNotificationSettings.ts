
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsFormData {
  emailNotifications: boolean;
  transactionAlerts: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  emailFrom: string;
  emailService: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
}

export const useNotificationSettings = () => {
  const { toast } = useToast();
  const [isEmailTestLoading, setIsEmailTestLoading] = useState(false);
  
  const form = useForm<NotificationSettingsFormData>({
    defaultValues: {
      emailNotifications: true,
      transactionAlerts: true,
      securityAlerts: true,
      marketingEmails: false,
      emailFrom: 'noreply@yumvipay.com',
      emailService: 'smtp'
    }
  });

  const handleSubmit = async (data: NotificationSettingsFormData) => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const testEmailNotification = async () => {
    setIsEmailTestLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Test Email Sent",
        description: "A test notification has been sent to your email address.",
      });
    } finally {
      setIsEmailTestLoading(false);
    }
  };

  return {
    form,
    isEmailTestLoading,
    handleSubmit: form.handleSubmit(handleSubmit),
    testEmailNotification
  };
};
