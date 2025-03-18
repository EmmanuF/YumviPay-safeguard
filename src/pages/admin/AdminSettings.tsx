import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { 
  Settings as SettingsIcon, 
  Mail, 
  Bell, 
  Palette, 
  Save, 
  RotateCcw,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();
  const [isEmailTestLoading, setIsEmailTestLoading] = useState(false);
  
  const generalForm = useForm({
    defaultValues: {
      siteName: 'Yumvi-Pay Admin',
      contactEmail: 'admin@yumvipay.com',
      supportPhone: '+1 (555) 123-4567',
      timezone: 'UTC'
    }
  });
  
  const appearanceForm = useForm({
    defaultValues: {
      theme: 'light',
      accentColor: 'purple',
      enableAnimations: true,
      sidebarCollapsed: false
    }
  });
  
  const notificationForm = useForm({
    defaultValues: {
      emailNotifications: true,
      transactionAlerts: true,
      securityAlerts: true,
      marketingEmails: false,
      emailFrom: 'noreply@yumvipay.com',
      emailService: 'smtp'
    }
  });
  
  const handleGeneralSubmit = (data: any) => {
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
  };
  
  const handleAppearanceSubmit = (data: any) => {
    toast({
      title: "Appearance Updated",
      description: "Your appearance settings have been saved.",
    });
  };
  
  const handleNotificationSubmit = (data: any) => {
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
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => toast({
              title: "Settings Reset",
              description: "All settings have been reset to default values.",
            })}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full gap-1 p-1 rounded-lg bg-gradient-to-r from-primary-50/90 to-secondary-50/90 shadow-md backdrop-blur-sm">
            <TabsTrigger 
              value="general" 
              className="transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <SettingsIcon className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 animate-slide-up">
            <Card className="border-primary-100/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure general platform settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(handleGeneralSubmit)} className="space-y-4">
                    <FormField
                      control={generalForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The name displayed in the admin panel and emails
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Primary contact email for admin communications
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="supportPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Support Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Support phone number for admin contacts
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="America/New_York">America/New_York</SelectItem>
                              <SelectItem value="Europe/London">Europe/London</SelectItem>
                              <SelectItem value="Africa/Douala">Africa/Douala</SelectItem>
                              <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Timezone used for displaying dates and times
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4 flex justify-end">
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 animate-slide-up">
            <Card className="border-primary-100/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the platform appearance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...appearanceForm}>
                  <form onSubmit={appearanceForm.handleSubmit(handleAppearanceSubmit)} className="space-y-4">
                    <FormField
                      control={appearanceForm.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a theme" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System Preference</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the theme for the admin interface
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={appearanceForm.control}
                      name="accentColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accent Color</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select accent color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                              <SelectItem value="red">Red</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Primary accent color used throughout the interface
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={appearanceForm.control}
                      name="enableAnimations"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Animations</FormLabel>
                            <FormDescription>
                              Toggle UI animations in the admin panel
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
                      control={appearanceForm.control}
                      name="sidebarCollapsed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Default Sidebar State</FormLabel>
                            <FormDescription>
                              Start with sidebar collapsed
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
                    
                    <div className="pt-4 flex justify-end">
                      <Button type="submit">
                        <Palette className="mr-2 h-4 w-4" />
                        Save Appearance
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 animate-slide-up">
            <Card className="border-primary-100/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure system notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(handleNotificationSubmit)} className="space-y-4">
                    <div className="grid gap-6">
                      <FormField
                        control={notificationForm.control}
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
                        control={notificationForm.control}
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
                        control={notificationForm.control}
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
                        control={notificationForm.control}
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
                    
                    <div className="space-y-4 pt-4">
                      <h3 className="text-lg font-medium">Email Configuration</h3>
                      
                      <FormField
                        control={notificationForm.control}
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
                        control={notificationForm.control}
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
                      
                      <div className="flex justify-between pt-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={testEmailNotification}
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
                        
                        <Button type="submit">
                          <Bell className="mr-2 h-4 w-4" />
                          Save Notification Settings
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 animate-slide-up">
            <Card className="border-primary-100/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced system settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Debug Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Enable detailed error messages and logging
                      </p>
                    </div>
                    <Switch 
                      onCheckedChange={(checked) => toast({
                        title: checked ? "Debug Mode Enabled" : "Debug Mode Disabled",
                        description: checked 
                          ? "Detailed error messages will now be displayed." 
                          : "Detailed error messages will be hidden."
                      })} 
                    />
                  </div>
                  
                  <div className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Maintenance Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Put the application in maintenance mode
                      </p>
                    </div>
                    <Switch 
                      onCheckedChange={(checked) => toast({
                        title: checked ? "Maintenance Mode Activated" : "Maintenance Mode Deactivated",
                        description: checked 
                          ? "The application is now in maintenance mode." 
                          : "The application is now accessible to all users."
                      })} 
                    />
                  </div>
                  
                  <div className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">API Rate Limiting</h3>
                      <p className="text-sm text-muted-foreground">
                        Enable rate limiting for API endpoints
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Usage Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Collect anonymous usage data
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => toast({
                  title: "Settings Saved",
                  description: "Advanced settings have been updated successfully.",
                })}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Save Advanced Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
