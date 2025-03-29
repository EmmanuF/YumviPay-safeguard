
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  MapPin 
} from 'lucide-react';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Contact Us | Yumvi-Pay</title>
        <meta name="description" content="Contact Yumvi-Pay's customer support team for assistance with your money transfers." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary-600">Send Us a Message</h2>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transaction">Transaction Issue</SelectItem>
                    <SelectItem value="account">Account Help</SelectItem>
                    <SelectItem value="payment">Payment Problem</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Please describe your issue or question in detail"
                  rows={5}
                  className="w-full"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
        
        {/* Contact Information */}
        <div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-primary-600">Contact Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary-500 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Email</p>
                  <a href="mailto:support@yumvi-pay.com" className="text-primary-600 hover:text-primary-700">
                    support@yumvi-pay.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary-500 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Phone</p>
                  <a href="tel:+18005551234" className="text-primary-600 hover:text-primary-700">
                    +1 (800) 555-1234
                  </a>
                  <p className="text-sm text-gray-600">Monday - Friday, 9am - 5pm UTC</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MessageSquare className="h-5 w-5 text-primary-500 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Live Chat</p>
                  <p className="text-gray-700">Available in our mobile app</p>
                  <p className="text-sm text-gray-600">24/7 for verified users</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-500 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Office</p>
                  <p className="text-gray-700">123 Financial District</p>
                  <p className="text-gray-700">New York, NY 10004</p>
                  <p className="text-gray-700">United States</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary-600">Frequently Asked Questions</h2>
            <p className="text-gray-700 mb-4">
              Find quick answers to common questions on our FAQ page.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/faq'}>
              Visit FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
