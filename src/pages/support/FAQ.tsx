
import React, { useState } from 'react';
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

// Define the question categories
type QuestionCategory = 'all' | 'getting-started' | 'transactions' | 'account' | 'payments' | 'security';

// Define the FAQ item structure
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: Exclude<QuestionCategory, 'all'>;
}

const FAQ = () => {
  // State for search query and selected category
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('all');

  // FAQ data organized by categories
  const faqItems: FAQItem[] = [
    // Getting Started
    {
      id: 'getting-started-1',
      question: 'How do I create an account with Yumvi-Pay?',
      answer: 'Creating an account with Yumvi-Pay is simple. Download our mobile app from the App Store or Google Play Store, tap "Sign Up," and follow the on-screen instructions. You\'ll need to provide your name, email address, and create a password. After verifying your email, you\'ll need to complete our KYC verification process to start sending money.',
      category: 'getting-started'
    },
    {
      id: 'getting-started-2',
      question: 'What information do I need to provide for verification?',
      answer: 'For verification, you\'ll need to provide a valid government-issued ID (passport, driver\'s license, or national ID), proof of address (utility bill or bank statement issued within the last 3 months), and in some cases, a selfie for biometric verification. This information is required to comply with international regulations and to protect you against fraud.',
      category: 'getting-started'
    },
    {
      id: 'getting-started-3',
      question: 'Which countries can I send money to?',
      answer: 'Yumvi-Pay currently supports money transfers to Cameroon, with plans to expand to Nigeria, Senegal, Ghana, Kenya, and other African countries soon. Check our app for the most up-to-date list of available countries and payment methods.',
      category: 'getting-started'
    },
    
    // Transactions
    {
      id: 'transactions-1',
      question: 'How long does it take for my money to arrive?',
      answer: 'For most transfers to mobile money accounts, funds are delivered instantly or within minutes after the transaction is processed. Bank transfers typically take 1-2 business days. The exact timing may vary depending on the recipient\'s country, payment method, and local banking hours.',
      category: 'transactions'
    },
    {
      id: 'transactions-2',
      question: 'What are the fees for sending money?',
      answer: 'Our fees vary depending on the amount sent, destination country, and payment method. We always display the exact fee and exchange rate before you confirm your transaction. Yumvi-Pay offers competitive rates with transparent pricing—no hidden fees. You can use our calculator in the app to see the exact amount your recipient will receive.',
      category: 'transactions'
    },
    {
      id: 'transactions-3',
      question: 'How can I track my transfer?',
      answer: 'You can track your transfer in real-time through the Yumvi-Pay app. Go to the "Transaction History" section, select the transfer you want to track, and view its current status. You\'ll also receive push notifications and email updates as your transfer progresses through each stage—from processing to delivery.',
      category: 'transactions'
    },
    
    // Account & Security
    {
      id: 'account-1',
      question: 'How do I reset my password?',
      answer: 'To reset your password, tap "Forgot Password" on the login screen. Enter your registered email address, and we\'ll send you a link to reset your password. For security reasons, the link is valid for 30 minutes. If you\'re still having trouble, contact our customer support team for assistance.',
      category: 'account'
    },
    {
      id: 'account-2',
      question: 'Is my personal information secure?',
      answer: 'Yes, protecting your information is our top priority. We use industry-standard encryption to secure your data both in transit and at rest. Our app supports biometric authentication (fingerprint/Face ID), and we comply with international data protection regulations. We never share your personal information with unauthorized third parties.',
      category: 'security'
    },
    
    // Payments
    {
      id: 'payments-1',
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including credit/debit cards, bank transfers, and mobile wallet payments. Available payment methods may vary depending on your location and the recipient\'s country.',
      category: 'payments'
    },
    {
      id: 'payments-2',
      question: 'Is there a minimum or maximum amount I can send?',
      answer: 'Yes, there are minimum and maximum transfer limits. The minimum amount is typically $10 USD (or equivalent), while maximum limits vary based on your verification level, payment method, and regulatory requirements in the sending and receiving countries.',
      category: 'payments'
    }
  ];

  // Filter FAQ items based on selected category and search query
  const filteredFAQItems = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Group filtered items by category for display
  const getItemsByCategory = (category: Exclude<QuestionCategory, 'all'>) => {
    return filteredFAQItems.filter(item => item.category === category);
  };

  // Categories to display
  const displayCategories: Exclude<QuestionCategory, 'all'>[] = ['getting-started', 'transactions', 'account', 'payments', 'security'];
  
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {/* FAQ Categories */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <Button 
          variant={selectedCategory === 'all' ? 'default' : 'outline'} 
          className="rounded-full"
          onClick={() => setSelectedCategory('all')}
        >
          All
        </Button>
        
        {displayCategories.map(category => (
          <Button 
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'} 
            className="rounded-full"
            onClick={() => setSelectedCategory(category)}
          >
            {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Button>
        ))}
      </div>
      
      {/* Accordion FAQ Items */}
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {/* Show all filtered items if 'all' is selected, otherwise show categorized sections */}
          {selectedCategory === 'all' ? (
            <>
              {displayCategories.map(category => {
                const categoryItems = getItemsByCategory(category);
                if (categoryItems.length === 0) return null;
                
                return (
                  <React.Fragment key={category}>
                    <h2 className="text-xl font-semibold mb-3 text-primary-700 mt-8">
                      {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h2>
                    
                    {categoryItems.map(item => (
                      <AccordionItem key={item.id} value={item.id} className="bg-white rounded-lg shadow-sm mb-3">
                        <AccordionTrigger className="px-4 py-3 hover:bg-primary-50/50 rounded-t-lg">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </React.Fragment>
                );
              })}
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-3 text-primary-700">
                {selectedCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h2>
              
              {filteredFAQItems.length > 0 ? (
                filteredFAQItems.map(item => (
                  <AccordionItem key={item.id} value={item.id} className="bg-white rounded-lg shadow-sm mb-3">
                    <AccordionTrigger className="px-4 py-3 hover:bg-primary-50/50 rounded-t-lg">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No questions found. Please try a different search term or category.</p>
                </div>
              )}
            </>
          )}
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
