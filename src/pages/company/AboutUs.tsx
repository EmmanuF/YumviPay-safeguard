import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import MobileAppLayout from '@/components/MobileAppLayout';
import { useLocale } from '@/contexts/LocaleContext';

const AboutUs: React.FC = () => {
  const { t } = useLocale();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>About Us | {t('app.name')}</title>
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
              About Yumvi-Pay
            </h1>
            <p className="text-gray-600">
              Connecting families across borders through seamless money transfers
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              At Yumvi-Pay, our mission is to make international money transfers to Africa affordable, 
              secure, and lightning-fast. We believe that financial connections should be as simple and 
              natural as staying in touch with a loved one.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Yumvi-Pay was born out of a personal frustration. Our founders experienced firsthand 
              the challenges of sending money back home to Cameroon – high fees, complicated processes, 
              and days of waiting. They knew there had to be a better way.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Founded in 2023, we've focused on building technology that bridges the gap between 
              international payment systems and local African payment networks. Starting with Cameroon 
              as our first market, we're expanding to connect more countries across Africa.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Our Values</h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-700 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-primary-700">Transparency</h3>
                  <p className="text-gray-600 text-sm">No hidden fees. Clear, upfront pricing so you know exactly what you're paying.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-700 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-primary-700">Security</h3>
                  <p className="text-gray-600 text-sm">Bank-grade encryption and compliance with international security standards.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-700 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-primary-700">Accessibility</h3>
                  <p className="text-gray-600 text-sm">Making our service work for everyone, regardless of technology comfort level.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-700 font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-primary-700">Innovation</h3>
                  <p className="text-gray-600 text-sm">Continuously improving our technology to deliver the best experience possible.</p>
                </div>
              </li>
            </ul>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-primary-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Join Us</h2>
            <p className="text-gray-700 leading-relaxed">
              We're just getting started on our journey to transform how money moves across borders. 
              Whether you're a customer, potential partner, or someone interested in joining our team, 
              we'd love to hear from you.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </MobileAppLayout>
  );
};

export default AboutUs;
