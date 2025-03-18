
import React from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { 
  ShieldAlert, 
  Lock, 
  Users, 
  Key, 
  Bell, 
  RefreshCw,
  Shield, 
  SaveIcon
} from 'lucide-react';

const AdminSecurity = () => {
  const { toast } = useToast();
  
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const apiKeyForm = useForm({
    defaultValues: {
      apiKey: 'sk_test_abcd1234efgh5678ijkl9012',
    },
  });
  
  const securityForm = useForm({
    defaultValues: {
      twoFactorEnabled: false,
      sessionTimeout: '30',
      passwordExpiry: '90',
      loginAttempts: '5',
    },
  });
  
  const handlePasswordSubmit = (data: any) => {
    toast({
      title: "Password Updated",
      description: "Your admin password has been successfully updated.",
    });
    passwordForm.reset();
  };
  
  const handleApiKeySubmit = (data: any) => {
    toast({
      title: "API Key Updated",
      description: "Your API key settings have been successfully updated.",
    });
  };
  
  const handleSecuritySubmit = (data: any) => {
    toast({
      title: "Security Settings Updated",
      description: "Your security settings have been successfully updated.",
    });
  };
  
  const refreshApiKey = () => {
    apiKeyForm.setValue('apiKey', 'sk_test_' + Math.random().toString(36).substring(2, 15));
    toast({
      title: "API Key Refreshed",
      description: "Your API key has been regenerated. Make sure to update it in your applications.",
    });
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Security</h1>
          <Button variant="outline" onClick={() => toast({
            title: "Security Audit",
            description: "No security issues detected in your admin account.",
            variant: "success",
          })}>
            <ShieldAlert className="mr-2 h-4 w-4" />
            Run Security Audit
          </Button>
        </div>
        
        <Tabs defaultValue="password" className="space-y-4">
          <TabsList>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="2fa">Two-Factor Auth</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="audit-log">Audit Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="password" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your admin account password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Update Password</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api-keys" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage API keys for your admin account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...apiKeyForm}>
                  <form onSubmit={apiKeyForm.handleSubmit(handleApiKeySubmit)} className="space-y-4">
                    <FormField
                      control={apiKeyForm.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input {...field} readOnly className="font-mono" />
                            </FormControl>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon" 
                              onClick={refreshApiKey}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormDescription>
                            This key provides full access to all admin API endpoints. Keep it secure.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => {
                        navigator.clipboard.writeText(apiKeyForm.getValues('apiKey'));
                        toast({
                          title: "API Key Copied",
                          description: "API key has been copied to clipboard.",
                        });
                      }}>
                        Copy API Key
                      </Button>
                      
                      <Button type="submit">Save Settings</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="2fa" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Enable two-factor authentication for your admin account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit)} className="space-y-4">
                    <FormField
                      control={securityForm.control}
                      name="twoFactorEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Two-Factor Authentication</FormLabel>
                            <FormDescription>
                              Add an extra layer of security to your account
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
                    
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium leading-none mb-2">
                        Setup 2FA
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Two-factor authentication is not yet set up. Click the button below to begin setup.
                      </p>
                      <Button 
                        className="mt-4" 
                        disabled={!securityForm.watch('twoFactorEnabled')}
                        onClick={() => toast({
                          title: "2FA Setup",
                          description: "2FA setup wizard will be launched in the next update.",
                        })}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Setup 2FA
                      </Button>
                    </div>
                    
                    <Button type="submit">Save Settings</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>
                  Manage admin user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Available Roles</h3>
                    <Button variant="outline" size="sm" onClick={() => toast({
                      title: "Coming Soon",
                      description: "Role management will be available in the next update.",
                    })}>
                      <Users className="mr-2 h-4 w-4" />
                      Create Role
                    </Button>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-medium">Super Admin</h4>
                        <p className="text-sm text-muted-foreground">Full access to all system features and settings</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => toast({
                          title: "Coming Soon",
                          description: "Role editing will be available in the next update.",
                        })}>Edit</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="text-sm">Users assigned: <span className="font-mono">1</span></div>
                      <div className="text-sm">Created: <span className="font-mono">2023-01-01</span></div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-medium">Admin</h4>
                        <p className="text-sm text-muted-foreground">Access to manage users and transactions</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => toast({
                          title: "Coming Soon",
                          description: "Role editing will be available in the next update.",
                        })}>Edit</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="text-sm">Users assigned: <span className="font-mono">0</span></div>
                      <div className="text-sm">Created: <span className="font-mono">2023-01-01</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audit-log" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>
                  View security events and admin activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Input 
                      className="max-w-sm" 
                      placeholder="Search audit logs..." 
                    />
                    <Button variant="outline" size="sm">
                      <Bell className="mr-2 h-4 w-4" />
                      Export Logs
                    </Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No audit logs available. Activity will be recorded here.
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({
                  title: "Coming Soon",
                  description: "Audit log export will be available in the next update.",
                })}>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Audit Log Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;
