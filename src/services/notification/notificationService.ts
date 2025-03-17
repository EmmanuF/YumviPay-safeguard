
import { toast } from "@/hooks/use-toast";
import { isOffline, addPausedRequest } from "@/utils/networkUtils";
import { supabase } from "@/integrations/supabase/client";
import { isPlatform } from '@/utils/platformUtils';

// Types for notifications
export interface NotificationRequest {
  recipientId: string;
  recipientName: string;
  recipientContact: string;
  transactionId: string;
  amount: number;
  notificationType: 'transaction_created' | 'transaction_completed' | 'transaction_failed';
  contactMethod: 'email' | 'sms' | 'both';
}

// Function to send email notifications
export const sendEmailNotification = async (
  to: string,
  subject: string,
  body: string
): Promise<boolean> => {
  if (isOffline()) {
    console.log('Device is offline. Email notification queued for later.');
    
    // Queue the request for when the device is back online
    addPausedRequest(() => sendEmailNotification(to, subject, body));
    
    toast({
      title: "Notification Queued",
      description: "Email will be sent when you're back online",
    });
    
    return false;
  }
  
  try {
    // In a real app, this would call a backend API endpoint
    // For now, we'll simulate success but log the info
    console.log(`Email notification would be sent to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: "Email Notification Sent",
      description: `Notification sent to ${to}`,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    
    toast({
      title: "Notification Failed",
      description: "Could not send email notification",
      variant: "destructive",
    });
    
    return false;
  }
};

// Function to send SMS notifications
export const sendSmsNotification = async (
  to: string,
  message: string
): Promise<boolean> => {
  if (isOffline()) {
    console.log('Device is offline. SMS notification queued for later.');
    
    // Queue the request for when the device is back online
    addPausedRequest(() => sendSmsNotification(to, message));
    
    toast({
      title: "Notification Queued",
      description: "SMS will be sent when you're back online",
    });
    
    return false;
  }
  
  try {
    // In a real app, this would call a backend API endpoint
    // For now, we'll simulate success but log the info
    console.log(`SMS notification would be sent to ${to}`);
    console.log(`Message: ${message}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    toast({
      title: "SMS Notification Sent",
      description: `Message sent to ${to}`,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send SMS notification:', error);
    
    toast({
      title: "Notification Failed",
      description: "Could not send SMS notification",
      variant: "destructive",
    });
    
    return false;
  }
};

// Main function to notify a recipient about a transaction
export const notifyRecipient = async (request: NotificationRequest): Promise<boolean> => {
  const { 
    recipientName, 
    recipientContact, 
    amount, 
    notificationType,
    contactMethod
  } = request;
  
  let emailSuccess = true;
  let smsSuccess = true;
  
  // Format the notification content based on the notification type
  const getNotificationContent = () => {
    switch (notificationType) {
      case 'transaction_created':
        return {
          subject: `Money is on the way from Yumvi Pay!`,
          emailBody: `Hello ${recipientName},\n\nYou have a pending transfer of $${amount} sent via Yumvi Pay. The funds are being processed and will be available soon.\n\nThank you for using Yumvi Pay!`,
          smsMessage: `Yumvi Pay: Hello ${recipientName}, you have a pending transfer of $${amount}. The money is on the way!`
        };
      case 'transaction_completed':
        return {
          subject: `$${amount} received from Yumvi Pay!`,
          emailBody: `Hello ${recipientName},\n\nGreat news! $${amount} has been successfully transferred to your account via Yumvi Pay. The money is now available for use.\n\nThank you for using Yumvi Pay!`,
          smsMessage: `Yumvi Pay: Hello ${recipientName}, $${amount} has been successfully transferred to your account and is now available.`
        };
      case 'transaction_failed':
        return {
          subject: `Yumvi Pay transfer notification`,
          emailBody: `Hello ${recipientName},\n\nWe regret to inform you that a recent transfer of $${amount} to your account via Yumvi Pay could not be completed. The sender has been notified.\n\nThank you for your understanding.`,
          smsMessage: `Yumvi Pay: Hello ${recipientName}, a transfer of $${amount} to you could not be completed. The sender has been notified.`
        };
    }
  };
  
  const content = getNotificationContent();
  
  // Send email if requested
  if (contactMethod === 'email' || contactMethod === 'both') {
    // Check if we have a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(recipientContact);
    
    if (isEmail) {
      emailSuccess = await sendEmailNotification(
        recipientContact,
        content.subject,
        content.emailBody
      );
    } else {
      console.warn('Invalid email format, notification not sent');
      emailSuccess = false;
    }
  }
  
  // Send SMS if requested
  if (contactMethod === 'sms' || contactMethod === 'both') {
    // Check if we have what looks like a phone number
    // This is a simple check - in a real app, you'd want more validation
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    const isPhone = phoneRegex.test(recipientContact.replace(/[\s-]/g, ''));
    
    if (isPhone) {
      smsSuccess = await sendSmsNotification(
        recipientContact,
        content.smsMessage
      );
    } else {
      console.warn('Invalid phone format, SMS not sent');
      smsSuccess = false;
    }
  }
  
  // Return true if all requested notifications were sent successfully
  return (contactMethod === 'both') 
    ? emailSuccess && smsSuccess 
    : (contactMethod === 'email' ? emailSuccess : smsSuccess);
};
