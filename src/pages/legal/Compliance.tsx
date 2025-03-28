
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import MobileAppLayout from '@/components/MobileAppLayout';
import { useLocale } from '@/contexts/LocaleContext';
import { CheckCircleIcon, ShieldCheckIcon, ScaleIcon, FileTextIcon, BuildingIcon } from 'lucide-react';

const Compliance: React.FC = () => {
  const { t } = useLocale();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const regulations = [
    {
      name: "Anti-Money Laundering (AML)",
      description: "We implement comprehensive AML procedures to prevent money laundering and terrorist financing."
    },
    {
      name: "Know Your Customer (KYC)",
      description: "Our robust KYC processes verify customer identities before enabling financial transactions."
    },
    {
      name: "Data Protection and Privacy",
      description: "We comply with relevant data protection regulations to safeguard personal information."
    },
    {
      name: "Payment Services Regulations",
      description: "Our operations adhere to applicable payment service regulations in all markets we serve."
    }
  ];
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Compliance | {t('app.name')}</title>
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
              Regulatory Compliance
            </h1>
            <p className="text-gray-600">
              Our commitment to legal and regulatory standards
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Our Compliance Framework</h2>
            <p className="text-gray-700 leading-relaxed">
              At Yumvi-Pay, we maintain a robust compliance framework to ensure adherence to all relevant 
              laws and regulations governing financial services and money transfers. Our compliance team 
              works diligently to monitor regulatory changes and update our policies and procedures accordingly.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Regulatory Compliance</h2>
            <div className="space-y-4 mt-4">
              {regulations.map((regulation, index) => (
                <div key={index} className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircleIcon className="h-5 w-5 text-primary-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-700">{regulation.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{regulation.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Licenses and Registrations</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Yumvi-Pay operates with appropriate licenses and registrations in the jurisdictions where we offer services.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <BuildingIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="font-medium text-primary-700">Cameroon</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Registered with the Ministry of Finance and authorized by the Bank of Central African States (BEAC).
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <BuildingIcon className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="font-medium text-primary-700">International</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Compliant with international money transfer regulations and partnerships with licensed financial institutions.
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Money Transfer Compliance</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <ScaleIcon className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Transaction Monitoring</h3>
                  <p className="text-gray-600 text-sm">All transactions are monitored for compliance with financial regulations.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileTextIcon className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Reporting</h3>
                  <p className="text-gray-600 text-sm">We fulfill all required regulatory reporting obligations.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Risk Assessment</h3>
                  <p className="text-gray-600 text-sm">Regular risk assessments to identify and mitigate potential compliance risks.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-primary-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Compliance Inquiries</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For any compliance-related questions or to request more information about our regulatory status, 
              please contact our compliance team.
            </p>
            <div className="p-3 bg-white rounded-lg">
              <h3 className="font-medium text-primary-700">Compliance Department</h3>
              <p className="text-primary-600">compliance@yumvipay.com</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </MobileAppLayout>
  );
};

export default Compliance;
