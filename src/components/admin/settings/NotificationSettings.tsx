
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import NotificationToggles from './notifications/NotificationToggles';
import EmailConfiguration from './notifications/EmailConfiguration';
import { useNotificationSettings } from '@/hooks/admin/settings/useNotificationSettings';

const NotificationSettings = () => {
  const { 
    form, 
    isEmailTestLoading, 
    handleSubmit, 
    testEmailNotification 
  } = useNotificationSettings();

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
          <form onSubmit={handleSubmit} className="space-y-4">
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
