
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
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Notification Settings
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Configure system notifications and alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:col-span-1">
                <h3 className="text-lg font-semibold">General Notifications</h3>
                <div className="bg-gradient-to-br from-primary-50/50 to-secondary-50/50 p-4 rounded-lg">
                  <NotificationToggles form={form} />
                </div>
              </div>
              
              <div className="space-y-4 md:col-span-1">
                <h3 className="text-lg font-semibold">Email Settings</h3>
                <div className="bg-gradient-to-br from-primary-50/50 to-secondary-50/50 p-4 rounded-lg">
                  <EmailConfiguration 
                    form={form}
                    isEmailTestLoading={isEmailTestLoading}
                    onTestEmail={testEmailNotification}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 transition-all duration-300"
              >
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
