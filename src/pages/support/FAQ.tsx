import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import MobileAppLayout from '@/components/MobileAppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLocale } from '@/contexts/LocaleContext';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Toggle question expansion
  const toggleQuestion = (question: string) => {
    if (expandedQuestions.includes(question)) {
      setExpandedQuestions(expandedQuestions.filter(q => q !== question));
    } else {
      setExpandedQuestions([...expandedQuestions, question]);
    }
  };
  
  // FAQ data remains the same
  const faqs: FAQItem[] = [
    {
      question: "How does Yumvi-Pay work?",
      answer: "Yumvi-Pay is a mobile app that lets you send money to Africa. You register, complete a quick KYC process through our partner Kado, and then you can send money to your recipients. We handle the currency conversion and ensure the money reaches your loved ones quickly and securely.",
      category: "general"
    },
    {
      question: "How long does a transfer take?",
      answer: "Most transfers are completed within minutes. However, depending on the payment method and recipient's location, some transfers might take up to 24 hours. You can track the status of your transfer in real-time through the app.",
      category: "transfers"
    },
    {
      question: "What payment methods can I use?",
      answer: "We support various payment methods including mobile money (MTN Mobile Money, Orange Money), bank transfers, and credit/debit cards. Available payment methods may vary depending on your location and the recipient's country.",
      category: "payments"
    },
    {
      question: "What are the fees for sending money?",
      answer: "Our fee structure is transparent and depends on the amount you're sending, the payment method, and the destination country. You'll always see the exact fee before confirming your transfer. We strive to offer competitive rates that are typically lower than traditional money transfer services.",
      category: "payments"
    },
    {
      question: "Is Yumvi-Pay secure?",
      answer: "Yes, security is our top priority. We use bank-level encryption to protect your personal and financial information. We comply with all relevant regulations, implement KYC verification for all users, and continuously monitor transactions for suspicious activity.",
      category: "security"
    },
    {
      question: "What countries can I send money to?",
      answer: "Currently, we focus on sending money to Cameroon. We plan to expand our services to more African countries soon. Stay tuned for updates on new supported countries!",
      category: "general"
    },
    {
      question: "How do I register for Yumvi-Pay?",
      answer: "Download the Yumvi-Pay mobile app from the App Store or Google Play Store, follow the registration process, and provide the required information to verify your identity. Once your account is set up, you can start sending money immediately.",
      category: "account"
    },
    {
      question: "What if the recipient doesn't have a mobile phone or bank account?",
      answer: "We offer various delivery options to accommodate recipients without mobile phones or bank accounts. Depending on the location, recipients may be able to pick up cash at participating locations. Contact our support team for more information.",
      category: "transfers"
    },
    {
      question: "Can I cancel a transfer after it's been sent?",
      answer: "You may be able to cancel a transfer if it hasn't been completed yet. Please contact our customer support team immediately for assistance. Note that once a transfer has been completed, it cannot be reversed.",
      category: "transfers"
    },
    {
      question: "What exchange rate do you use?",
      answer: "We use real-time market exchange rates and strive to offer competitive rates. The exact exchange rate for your transaction will be displayed before you confirm the transfer, so you'll know exactly how much the recipient will receive.",
      category: "payments"
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data privacy very seriously. We use advanced encryption and security measures to protect your personal information. We only collect information that is necessary for the service and never share your data with unauthorized third parties. Please refer to our Privacy Policy for more details.",
      category: "security"
    },
    {
      question: "What should I do if I have a problem with my transfer?",
      answer: "If you encounter any issues with your transfer, please contact our customer support team through the app, via email at support@yumvi-pay.com, or by calling our support number. Our team is available to assist you 24/7.",
      category: "support"
    }
  ];
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'general', name: 'General Information' },
    { id: 'account', name: 'Account Management' },
    { id: 'transfers', name: 'Money Transfers' },
    { id: 'payments', name: 'Payments & Fees' },
    { id: 'security', name: 'Security & Privacy' },
    { id: 'support', name: 'Customer Support' }
  ];
  
  // Filter FAQs based on search query and selected category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Frequently Asked Questions | {t('app.name')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-primary-800 mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Yumvi-Pay, money transfers, and our services. 
            If you can't find what you're looking for, please contact our support team.
          </p>
        </motion.div>
        
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative mb-4">
            <Input
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "" : "bg-white"}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>
        
        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {filteredFAQs.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-1">
              {filteredFAQs.map((faq, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Separator className="my-1" />}
                  <div className="py-2 px-4">
                    <button
                      onClick={() => toggleQuestion(faq.question)}
                      className="flex justify-between items-center w-full text-left py-3"
                    >
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                      {expandedQuestions.includes(faq.question) ? (
                        <ChevronDown className="h-5 w-5 text-primary-600" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedQuestions.includes(faq.question) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-600 pb-3 pt-1"
                      >
                        <p>{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No results found for your search. Please try a different query.</p>
            </div>
          )}
          
          <div className="text-center mt-8 p-6 bg-primary-50 rounded-xl">
            <h3 className="font-semibold text-primary-700 mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">
              Contact our support team for personalized assistance with any issues or questions you might have.
            </p>
            <Button onClick={() => window.location.href = '/contact'}>
              Contact Support
            </Button>
          </div>
        </motion.div>
      </div>
    </MobileAppLayout>
  );
};

export default FAQ;
