
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Mail, Phone, FileText, Clock, AlertCircle } from 'lucide-react';

const Support = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Support Center | Yumvi-Pay</title>
        <meta name="description" content="Get help and support for your Yumvi-Pay account and transactions." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-3 text-primary-700">Support Center</h1>
      <p className="text-lg text-gray-600 mb-8">
        We're here to help with any questions or issues you may have.
      </p>
      
      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="guides">Help Guides</TabsTrigger>
          <TabsTrigger value="status">Service Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contact" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-primary-600" />
                  Live Chat
                </CardTitle>
                <CardDescription>Available 24/7</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Chat with our support team for immediate assistance with your questions.
                </p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-primary-600" />
                  Email Support
                </CardTitle>
                <CardDescription>Response within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Send us an email and our team will get back to you as soon as possible.
                </p>
                <Button variant="outline" className="w-full">
                  support@yumvi-pay.com
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-primary-600" />
                  Phone Support
                </CardTitle>
                <CardDescription>Mon-Fri, 9am-5pm (GMT)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Call us directly to speak with a customer support representative.
                </p>
                <Button variant="outline" className="w-full">
                  +1 (555) 123-4567
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <Input id="subject" placeholder="What is your inquiry about?" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <Textarea id="message" placeholder="How can we help you?" rows={5} />
              </div>
              
              <Button type="submit" className="w-full md:w-auto">Send Message</Button>
            </form>
          </div>
        </TabsContent>
        
        <TabsContent value="guides" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-primary-600" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-primary-600 hover:underline cursor-pointer">How to create an account</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Setting up your profile</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Adding your first recipient</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Making your first transfer</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-primary-600" />
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-primary-600 hover:underline cursor-pointer">How to send money</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Tracking your transfer</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Cancelling a transfer</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Transfer fees explained</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-primary-600" />
                  Account Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-primary-600 hover:underline cursor-pointer">Updating your personal information</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Changing your password</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Managing payment methods</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Setting up biometric authentication</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-primary-600" />
                  Recipients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-primary-600 hover:underline cursor-pointer">Adding a new recipient</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Editing recipient details</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Removing recipients</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Importing contacts</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-primary-600" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-primary-600 hover:underline cursor-pointer">Securing your account</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Using transaction PIN</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Biometric authentication setup</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">What to do if you suspect fraud</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-primary-600" />
                  Troubleshooting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-primary-600 hover:underline cursor-pointer">Common error messages</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Payment issues</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">App not working properly</li>
                  <li className="text-primary-600 hover:underline cursor-pointer">Recovering your account</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="status" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <h2 className="text-xl font-semibold">All Systems Operational</h2>
            </div>
            <p className="text-gray-600">
              Updated 10 minutes ago
            </p>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-primary-600" />
                    <span>Service Status</span>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Mobile App</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Website</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">Payment Processing</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">API</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">KYC Verification</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-primary-600" />
                  Recent Incidents
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="border-b pb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">Scheduled Maintenance</span>
                      <span className="text-sm text-gray-500">May 15, 2023</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Scheduled maintenance completed successfully. All systems back online.
                    </p>
                  </div>
                  <div className="border-b pb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">Payment Processing Delay</span>
                      <span className="text-sm text-gray-500">April 28, 2023</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Some users experienced delays in payment processing. Issue resolved.
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">App Performance Issue</span>
                      <span className="text-sm text-gray-500">April 10, 2023</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Mobile app performance issues. Fixed with app update v2.3.1.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Support;
