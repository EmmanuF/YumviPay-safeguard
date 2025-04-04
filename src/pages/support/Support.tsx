import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MessageCircle, Phone, Mail, HelpCircle, FileText, Video } from 'lucide-react';
const Support = () => {
  const navigate = useNavigate();

  // Handle button clicks
  const handleOpenChat = () => {
    toast.info('Live chat is opening...', {
      description: 'This feature would connect to a live chat service in the production app.'
    });
  };
  const handleCallSupport = () => {
    // In a native app, this would use Capacitor to open the phone app
    window.location.href = 'tel:+18005551234';
    toast.info('Dialing support number...');
  };
  const navigateTo = (path: string) => {
    navigate(path);
  };
  return <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Support | Yumvi-Pay</title>
        <meta name="description" content="Get help and support for your Yumvi-Pay account and transactions." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Customer Support</h1>
      
      <div className="prose max-w-none mb-10">
        <p className="text-lg">
          We're here to help you with any questions or issues you may have with your Yumvi-Pay account or transactions. 
          Choose from the support options below.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Live Chat Support Card */}
        <Card>
          <CardHeader className="pb-4">
            <MessageCircle className="h-8 w-8 text-primary-500 mb-2" />
            <CardTitle>Live Chat Support</CardTitle>
            <CardDescription>
              Chat with our support team in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              Available 24/7 for verified users. Connect with a support agent through our mobile app 
              for immediate assistance.
            </p>
            <Button className="w-full" onClick={handleOpenChat}>
              Open Chat
            </Button>
          </CardContent>
        </Card>
        
        {/* Phone Support Card */}
        <Card>
          <CardHeader className="pb-4">
            <Phone className="h-8 w-8 text-primary-500 mb-2" />
            <CardTitle>Phone Support</CardTitle>
            <CardDescription>
              Speak directly with our support team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">Call us Monday through Friday, 9am - 5pm CST. Our support agents speak English and French.</p>
            <Button variant="outline" className="w-full" onClick={handleCallSupport}>+1 (832) 265-7907</Button>
          </CardContent>
        </Card>
        
        {/* Email Support Card */}
        <Card>
          <CardHeader className="pb-4">
            <Mail className="h-8 w-8 text-primary-500 mb-2" />
            <CardTitle>Email Support</CardTitle>
            <CardDescription>
              Send us your question or issue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              Email our support team and we'll respond within 24 hours. For faster service, include your 
              transaction ID or account details.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigateTo('/contact')}>
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6 text-primary-700">Self-Service Resources</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* FAQ Card */}
        <Card>
          <CardHeader className="pb-4">
            <HelpCircle className="h-8 w-8 text-primary-500 mb-2" />
            <CardTitle>FAQ</CardTitle>
            <CardDescription>
              Frequently asked questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              Find answers to common questions about our services, account management, transactions, and more.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigateTo('/faq')}>
              View FAQ
            </Button>
          </CardContent>
        </Card>
        
        {/* User Guides Card */}
        <Card>
          <CardHeader className="pb-4">
            <FileText className="h-8 w-8 text-primary-500 mb-2" />
            <CardTitle>User Guides</CardTitle>
            <CardDescription>
              Step-by-step instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              Detailed guides to help you navigate our app, send money, manage recipients, and customize your account settings.
            </p>
            <Button variant="outline" className="w-full" onClick={() => toast.info('User guides will be available soon', {
            description: 'We\'re currently developing comprehensive user guides for the app.'
          })}>
              View Guides
            </Button>
          </CardContent>
        </Card>
        
        {/* Video Tutorials Card */}
        <Card>
          <CardHeader className="pb-4">
            <Video className="h-8 w-8 text-primary-500 mb-2" />
            <CardTitle>Video Tutorials</CardTitle>
            <CardDescription>
              Watch and learn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              Visual walkthroughs of key features and processes in our mobile app. Perfect for visual learners.
            </p>
            <Button variant="outline" className="w-full" onClick={() => toast.info('Video tutorials coming soon', {
            description: 'Our team is creating video tutorials to help you get the most out of Yumvi-Pay.'
          })}>
              Watch Videos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Support;