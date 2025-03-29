
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const FAQ = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>FAQ | Yumvi-Pay</title>
        <meta name="description" content="Frequently asked questions about Yumvi-Pay's money transfer services." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Frequently Asked Questions</h1>
      
      {/* Search Box */}
      <div className="mb-10 max-w-lg mx-auto">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for questions..."
            className="pl-10 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {/* FAQ Categories */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <Button variant="outline" className="rounded-full">All</Button>
        <Button variant="outline" className="rounded-full">Getting Started</Button>
        <Button variant="outline" className="rounded-full">Transactions</Button>
        <Button variant="outline" className="rounded-full">Account</Button>
        <Button variant="outline" className="rounded-full">Payments</Button>
        <Button variant="outline" className="rounded-full">Security</Button>
      </div>
      
      {/* Accordion FAQ Items */}
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {/* Getting Started */}
          <h2 className="text-xl font-semibold mb-3 text-primary-700 mt-8">Getting Started</h2>
          
          <AccordionItem value="getting-started-1" className="bg-white rounded-lg shadow-sm mb-3">
            <AccordionTrigger className="px-4 py-3 hover:bg-primary-50/50 rounded-t-lg">
              How do I create an account with Yumvi-Pay?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              Creating an account with Yumvi-Pay is simple. Download our mobile app from the App Store or Google Play Store, 
              tap "Sign Up," and follow the on-screen instructions. You'll need to provide your name, email address, and 
              create a password. After verifying your email, you'll need to complete our KYC verification process to start 
              sending money.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="getting-started-2" className="bg-white rounded-lg shadow-sm mb-3">
            <AccordionTrigger className="px-4 py-3 hover:bg-primary-50/50 rounded-t-lg">
              What information do I need to provide for verification?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              For verification, you'll need to provide a valid government-issued ID (passport, driver's license, or national ID), 
              proof of address (utility bill or bank statement issued within the last 3 months), and in some cases, a selfie 
              for biometric verification. This information is required to comply with international regulations and to protect 
              you against fraud.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="getting-started-3" className="bg-white rounded-lg shadow-sm mb-3">
            <AccordionTrigger className="px-4 py-3 hover:bg-primary-50/50 rounded-t-lg">
              Which countries can I send money to?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              Yumvi-Pay currently supports money transfers to Cameroon, with plans to expand to Nigeria, Senegal, Ghana, 
              Kenya, and other African countries soon. Check our app for the most up-to-date list of available countries 
              and payment methods.
            </AccordionContent>
          </AccordionItem>
          
          {/* Transactions */}
          <h2 className="text-xl font-semibold mb-3 text-primary-700 mt-8">Transactions</h2>
          
          <AccordionItem value="transactions-1" className="bg-white rounded-lg shadow-sm mb-3">
            <AccordionTrigger className="px-4 py-3 hover:bg-primary-50/50 rounded-t-lg">
              How long does it take for my money to arrive?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              For most transfers to mobile money accounts, funds are delivered instantly or within minutes after the transaction 
              is processed. Bank transfers typically take 1-2 business days. The exact timing may vary depending on the recipient's 
              country, payment method, and local banking hours.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="transactions-2" className="bg-white rounded-lg shadow-sm mb-3">
            <AccordionTrigger className="px-4 py-3 hover:bg-primary-50/50 rounded-t-lg">
              What are the fees for sending money?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              Our fees vary depending on the amount sent, destination country, and payment method. We always display the exact 
              fee and exchange rate before you confirm your transaction. Yumvi-Pay offers competitive rates with transparent 
              pricing—no hidden fees. You can use our calculator in the app to see the exact amount your recipient will receive.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="transactions-3" className="bg-white rounded-lg shadow-sm mb-3">
            <AccordionTrigger className="px-4 py-3 hover:bg-primary-50/50 rounded-t-lg">
              How can I track my transfer?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              You can track your transfer in real-time through the Yumvi-Pay app. Go to the "Transaction History" section, 
              select the transfer you want to track, and view its current status. You'll also receive push notifications and 
              email updates as your transfer progresses through each stage—from processing to delivery.
            </AccordionContent>
          </AccordionItem>
          
          {/* Account */}
          <h2 className="text-xl font-semibold mb-3 text-primary-700 mt-8">Account & Security</h2>
          
          <AccordionItem value="account-1" className="bg-white rounded-lg shadow-sm mb-3">
            <AccordionTrigger className="px-4 py-3 hover:bg-primary-50/50 rounded-t-lg">
              How do I reset my password?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              To reset your password, tap "Forgot Password" on the login screen. Enter your registered email address, and we'll 
              send you a link to reset your password. For security reasons, the link is valid for 30 minutes. If you're still 
              having trouble, contact our customer support team for assistance.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="account-2" className="bg-white rounded-lg shadow-sm mb-3">
            <AccordionTrigger className="px-4 py-3 hover:bg-primary-50/50 rounded-t-lg">
              Is my personal information secure?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              Yes, protecting your information is our top priority. We use industry-standard encryption to secure your data 
              both in transit and at rest. Our app supports biometric authentication (fingerprint/Face ID), and we comply with 
              international data protection regulations. We never share your personal information with unauthorized third parties.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      {/* Still Need Help Section */}
      <div className="mt-16 bg-primary-50 rounded-lg p-8 text-center max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-3">Still Need Help?</h2>
        <p className="mb-6 text-gray-700">
          Can't find what you're looking for? Our support team is ready to assist you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="default" onClick={() => window.location.href = '/contact'}>
            Contact Support
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/support'}>
            View Support Options
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
