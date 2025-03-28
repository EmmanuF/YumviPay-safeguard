
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import MobileAppLayout from '@/components/MobileAppLayout';
import { useLocale } from '@/contexts/LocaleContext';
import { CookieIcon, InfoIcon, ShieldIcon, SettingsIcon, CheckSquareIcon } from 'lucide-react';

const CookiesPolicy: React.FC = () => {
  const { t } = useLocale();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const cookieTypes = [
    {
      type: "Essential Cookies",
      description: "These cookies are necessary for the website to function and cannot be disabled. They are usually set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.",
      required: true
    },
    {
      type: "Functional Cookies",
      description: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.",
      required: false
    },
    {
      type: "Analytics Cookies",
      description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.",
      required: false
    },
    {
      type: "Marketing Cookies",
      description: "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant ads on other sites.",
      required: false
    }
  ];
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Cookies Policy | {t('app.name')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <motion.div
          className="space-y-6"
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
              Cookies Policy
            </h1>
            <p className="text-gray-600">
              How we use cookies and similar technologies on our website
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">What Are Cookies?</h2>
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center mt-1">
                <CookieIcon className="h-5 w-5 text-primary-700" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and provide information to the website owners. 
                Cookies help us improve your experience on our site and deliver personalized services.
              </p>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">How We Use Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Yumvi-Pay, we use cookies for various purposes, including:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <InfoIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-700">Remembering your preferences</h3>
                  <p className="text-gray-600 text-sm">We use cookies to remember your settings and preferences on our site.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <ShieldIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-700">Authentication and security</h3>
                  <p className="text-gray-600 text-sm">Cookies help us verify your account and determine when you're logged in to provide appropriate access to features.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <SettingsIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-700">Site functionality</h3>
                  <p className="text-gray-600 text-sm">Some cookies are essential for the basic functionality of our website.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Types of Cookies We Use</h2>
            <div className="space-y-4 mt-4">
              {cookieTypes.map((cookie, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-primary-700">{cookie.type}</h3>
                    {cookie.required ? (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Required</span>
                    ) : (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{cookie.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Managing Your Cookie Preferences</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can control cookies through your browser settings. Most browsers allow you to refuse cookies, 
              accept cookies from specific websites, or disable cookies altogether. Please note that disabling 
              certain cookies may affect the functionality of our website.
            </p>
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-medium text-primary-700 flex items-center">
                <CheckSquareIcon className="h-5 w-5 mr-2" />
                Your Current Cookie Settings
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                You have accepted all cookies. You can change your cookie preferences at any time.
              </p>
              <button className="mt-3 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                Update Cookie Preferences
              </button>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-primary-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Changes to Our Cookies Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update our Cookies Policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the "Last Updated" date.
            </p>
            <p className="text-gray-500 text-sm mt-4">Last Updated: March 15, 2024</p>
          </motion.div>
        </motion.div>
      </div>
    </MobileAppLayout>
  );
};

export default CookiesPolicy;
