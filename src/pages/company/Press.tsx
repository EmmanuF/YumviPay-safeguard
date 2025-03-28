
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import MobileAppLayout from '@/components/MobileAppLayout';
import { useLocale } from '@/contexts/LocaleContext';
import { NewspaperIcon, CalendarIcon } from 'lucide-react';

const Press: React.FC = () => {
  const { t } = useLocale();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const pressReleases = [
    {
      title: "Yumvi-Pay Launches Cross-Border Payment Platform for Cameroon",
      date: "September 15, 2023",
      summary: "Yumvi-Pay announces the launch of its innovative cross-border payment platform designed to make money transfers to Cameroon faster, cheaper, and more accessible."
    },
    {
      title: "Yumvi-Pay Completes Seed Funding Round",
      date: "December 5, 2023",
      summary: "Yumvi-Pay secures $1.5 million in seed funding to expand its money transfer services across West and Central Africa."
    },
    {
      title: "Yumvi-Pay Partners with Orange Money for Expanded Coverage",
      date: "February 20, 2024",
      summary: "New partnership with Orange Money allows Yumvi-Pay users to send money directly to mobile money accounts across Cameroon."
    }
  ];
  
  const mediaContacts = {
    press: {
      name: "Media Relations Team",
      email: "press@yumvipay.com"
    },
    partnerships: {
      name: "Partnership Inquiries",
      email: "partnerships@yumvipay.com"
    }
  };
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Press & Media | {t('app.name')}</title>
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
              Press & Media
            </h1>
            <p className="text-gray-600">
              Latest news and media resources about Yumvi-Pay
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Press Releases</h2>
            <div className="space-y-4">
              {pressReleases.map((release, index) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{release.date}</span>
                  </div>
                  <h3 className="font-medium text-primary-700">{release.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{release.summary}</p>
                  <button className="mt-2 text-primary-700 text-sm font-medium hover:text-primary-800 transition-colors">
                    Read more →
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Media Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                <NewspaperIcon className="h-6 w-6 text-primary-600 mb-2" />
                <h3 className="font-medium text-primary-700">Press Kit</h3>
                <p className="text-gray-600 text-sm mt-1">Download our press kit including logos, product images, and fact sheets.</p>
                <button className="mt-3 text-primary-700 text-sm font-medium hover:text-primary-800 transition-colors">
                  Download →
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                <NewspaperIcon className="h-6 w-6 text-primary-600 mb-2" />
                <h3 className="font-medium text-primary-700">Brand Guidelines</h3>
                <p className="text-gray-600 text-sm mt-1">Access our brand guidelines and usage policies for media partners.</p>
                <button className="mt-3 text-primary-700 text-sm font-medium hover:text-primary-800 transition-colors">
                  View guidelines →
                </button>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Media Contact</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For press inquiries, interview requests, or additional information about Yumvi-Pay, 
              please contact our media relations team.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-primary-50 rounded-lg">
                <h3 className="font-medium text-primary-700">{mediaContacts.press.name}</h3>
                <p className="text-primary-600">{mediaContacts.press.email}</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <h3 className="font-medium text-primary-700">{mediaContacts.partnerships.name}</h3>
                <p className="text-primary-600">{mediaContacts.partnerships.email}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-primary-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Media Coverage</h2>
            <p className="text-gray-700 leading-relaxed">
              For the latest news coverage about Yumvi-Pay, please check back regularly. 
              We're updating this section as new articles and features are published.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </MobileAppLayout>
  );
};

export default Press;
