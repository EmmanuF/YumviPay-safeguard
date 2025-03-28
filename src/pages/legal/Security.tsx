
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import MobileAppLayout from '@/components/MobileAppLayout';
import { useLocale } from '@/contexts/LocaleContext';
import { ShieldIcon, LockIcon, ServerIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';

const Security: React.FC = () => {
  const { t } = useLocale();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const securityFeatures = [
    {
      title: "End-to-End Encryption",
      description: "All sensitive data is encrypted during transmission and storage using industry-standard encryption protocols.",
      icon: <LockIcon className="h-6 w-6 text-primary-600" />
    },
    {
      title: "Biometric Authentication",
      description: "Our mobile app supports fingerprint and facial recognition for secure account access on supported devices.",
      icon: <ShieldIcon className="h-6 w-6 text-primary-600" />
    },
    {
      title: "Secure Infrastructure",
      description: "Our systems are hosted on secure cloud infrastructure with regular security audits and penetration testing.",
      icon: <ServerIcon className="h-6 w-6 text-primary-600" />
    },
    {
      title: "Fraud Monitoring",
      description: "Advanced monitoring systems detect and prevent suspicious activities and potential fraud attempts.",
      icon: <AlertTriangleIcon className="h-6 w-6 text-primary-600" />
    }
  ];
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Security | {t('app.name')}</title>
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
              Security at Yumvi-Pay
            </h1>
            <p className="text-gray-600">
              How we protect your money and personal information
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Our Commitment to Security</h2>
            <p className="text-gray-700 leading-relaxed">
              At Yumvi-Pay, the security of your transactions and personal information is our top priority. 
              We employ multiple layers of security measures to protect your data and financial transactions. 
              Our security practices follow industry standards and are regularly updated to address evolving threats.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Security Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-700">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Transaction Verification</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Every transaction on Yumvi-Pay goes through a multi-step verification process to ensure 
              legitimacy and protect against fraud. Your money transfers are monitored in real-time 
              for suspicious activity.
            </p>
            <div className="space-y-3 mt-4">
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Identity Verification</h3>
                  <p className="text-gray-600 text-sm">We verify the identity of all users through secure KYC procedures.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Transaction PIN</h3>
                  <p className="text-gray-600 text-sm">Additional PIN verification for sensitive operations.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Activity Monitoring</h3>
                  <p className="text-gray-600 text-sm">Continuous monitoring of account activities to detect unauthorized access.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Your Role in Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              While we maintain robust security systems, your vigilance also plays a crucial role in keeping your account secure.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <h3 className="font-medium text-yellow-800">Security Tips</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1">
                <li>Use a strong, unique password for your Yumvi-Pay account</li>
                <li>Enable biometric authentication if available on your device</li>
                <li>Never share your login credentials or transaction PIN with anyone</li>
                <li>Be wary of phishing attempts - we will never ask for your password via email or SMS</li>
                <li>Keep your mobile device's operating system and apps updated</li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-primary-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Report Security Concerns</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you notice any suspicious activity on your account or have security concerns, 
              please contact our security team immediately.
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
              Contact Security Team
            </button>
          </motion.div>
        </motion.div>
      </div>
    </MobileAppLayout>
  );
};

export default Security;
