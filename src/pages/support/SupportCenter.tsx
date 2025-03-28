
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import MobileAppLayout from '@/components/MobileAppLayout';
import { useLocale } from '@/contexts/LocaleContext';
import { HelpCircleIcon, MessageCircleIcon, PhoneIcon, FileTextIcon, SearchIcon } from 'lucide-react';

const SupportCenter: React.FC = () => {
  const { t } = useLocale();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const supportCategories = [
    {
      title: "Account Issues",
      icon: <UserIcon className="h-6 w-6 text-primary-600" />,
      topics: ["Sign in problems", "Account verification", "Password reset", "Profile updates"]
    },
    {
      title: "Transactions",
      icon: <ArrowRightLeftIcon className="h-6 w-6 text-primary-600" />,
      topics: ["Transaction status", "Failed transfers", "Cancelled payments", "Exchange rates"]
    },
    {
      title: "Recipients",
      icon: <UsersIcon className="h-6 w-6 text-primary-600" />,
      topics: ["Adding recipients", "Editing recipient details", "Payment methods"]
    },
    {
      title: "App & Technical Support",
      icon: <SmartphoneIcon className="h-6 w-6 text-primary-600" />,
      topics: ["App installation", "App crashes", "Feature requests", "Compatibility issues"]
    }
  ];
  
  const contactMethods = [
    {
      title: "Chat Support",
      description: "Chat with our support team for immediate assistance",
      icon: <MessageCircleIcon className="h-6 w-6 text-primary-600" />,
      action: "Start Chat",
      availability: "24/7"
    },
    {
      title: "Phone Support",
      description: "Call us directly for urgent matters",
      icon: <PhoneIcon className="h-6 w-6 text-primary-600" />,
      action: "Call Now",
      availability: "Mon-Fri, 8AM-8PM"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message, we'll respond within 24 hours",
      icon: <MailIcon className="h-6 w-6 text-primary-600" />,
      action: "Send Email",
      availability: "Response within 24 hours"
    }
  ];
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Support Center | {t('app.name')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.div variants={fadeIn}>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-800 mb-2">
              Support Center
            </h1>
            <p className="text-gray-600">
              Get help with your account, transactions, and more
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="relative">
              <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search for help with..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Payments</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Account</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Recipients</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Mobile app</span>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-primary-700">{category.title}</h2>
                    <p className="text-gray-500 text-sm">
                      {category.topics.length} topics
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 ml-2">
                  {category.topics.map((topic, i) => (
                    <li key={i} className="text-gray-700 hover:text-primary-700 cursor-pointer flex items-center">
                      <span className="h-1.5 w-1.5 bg-primary-500 rounded-full mr-2"></span>
                      {topic}
                    </li>
                  ))}
                </ul>
                <button className="mt-4 text-primary-700 font-medium hover:text-primary-800 transition-colors flex items-center text-sm">
                  View all topics
                  <span className="ml-1">→</span>
                </button>
              </div>
            ))}
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-4">Popular Help Articles</h2>
            <div className="space-y-4">
              <article className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileTextIcon className="h-4 w-4 text-primary-600" />
                  <h3 className="font-medium text-primary-700">How to add a new recipient</h3>
                </div>
                <p className="text-gray-600 text-sm ml-6">
                  Step-by-step guide to adding and verifying new recipients for money transfers.
                </p>
              </article>
              <article className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileTextIcon className="h-4 w-4 text-primary-600" />
                  <h3 className="font-medium text-primary-700">Understanding transaction fees</h3>
                </div>
                <p className="text-gray-600 text-sm ml-6">
                  Explanation of our fee structure and how we ensure competitive exchange rates.
                </p>
              </article>
              <article className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileTextIcon className="h-4 w-4 text-primary-600" />
                  <h3 className="font-medium text-primary-700">Tracking your transfer</h3>
                </div>
                <p className="text-gray-600 text-sm ml-6">
                  Learn how to track your money transfer and understand different status notifications.
                </p>
              </article>
              <article>
                <div className="flex items-center gap-2 mb-1">
                  <FileTextIcon className="h-4 w-4 text-primary-600" />
                  <h3 className="font-medium text-primary-700">Troubleshooting payment issues</h3>
                </div>
                <p className="text-gray-600 text-sm ml-6">
                  Common payment issues and how to resolve them quickly.
                </p>
              </article>
            </div>
            <button className="mt-4 text-primary-700 font-medium hover:text-primary-800 transition-colors flex items-center">
              View all articles
              <span className="ml-1">→</span>
            </button>
          </motion.div>
          
          <motion.variants variants={fadeIn}>
            <h2 className="text-xl font-semibold text-primary-800 mb-4">Contact Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm flex flex-col h-full">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-primary-700 mb-1">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 flex-grow">{method.description}</p>
                  <div className="mt-auto">
                    <span className="text-xs text-gray-500 block mb-2">{method.availability}</span>
                    <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors">
                      {method.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.variants>
          
          <motion.div variants={fadeIn} className="bg-primary-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Feedback</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your feedback helps us improve our service. Let us know how we can make your experience better.
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
              Send Feedback
            </button>
          </motion.div>
        </motion.div>
      </div>
    </MobileAppLayout>
  );
};

const ArrowRightLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="m18 8-6-6" />
    <path d="M18 2v6h-6" />
    <path d="m6 16 6 6" />
    <path d="M6 22v-6h6" />
  </svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SmartphoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default SupportCenter;
