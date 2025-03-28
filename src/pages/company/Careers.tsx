
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import MobileAppLayout from '@/components/MobileAppLayout';
import { useLocale } from '@/contexts/LocaleContext';
import { BriefcaseIcon, Building2Icon, UserIcon, MedalIcon } from 'lucide-react';

const Careers: React.FC = () => {
  const { t } = useLocale();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const openPositions = [
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote (Africa)",
      type: "Full-time"
    },
    {
      title: "Mobile App Developer",
      department: "Engineering",
      location: "Remote (Africa)",
      type: "Full-time"
    },
    {
      title: "Customer Support Specialist",
      department: "Operations",
      location: "Douala, Cameroon",
      type: "Full-time"
    }
  ];
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Careers | {t('app.name')}</title>
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
              Join Our Team
            </h1>
            <p className="text-gray-600">
              Help us revolutionize money transfers to Africa
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Why Work With Us</h2>
            <p className="text-gray-700 leading-relaxed">
              At Yumvi-Pay, we're building technology that makes a real difference in people's lives.
              Our team is passionate about solving the challenges of cross-border payments
              and making financial services more inclusive and accessible across Africa.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Our Culture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <MedalIcon className="h-5 w-5 text-primary-700" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-700">Excellence</h3>
                  <p className="text-gray-600 text-sm">We strive for excellence in everything we do</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-5 w-5 text-primary-700" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-700">User-Centered</h3>
                  <p className="text-gray-600 text-sm">Everything we build starts with our users' needs</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Open Positions</h2>
            <div className="space-y-4 mt-4">
              {openPositions.map((position, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-primary-700">{position.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{position.department}</p>
                    </div>
                    <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {position.type}
                    </span>
                  </div>
                  <div className="flex items-center mt-3 text-gray-500 text-sm">
                    <Building2Icon className="h-4 w-4 mr-1" />
                    <span>{position.location}</span>
                  </div>
                  <button className="mt-3 text-primary-700 text-sm font-medium hover:text-primary-800 transition-colors">
                    View details →
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-primary-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary-700 mb-3">Join Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Don't see a position that fits your skills? We're always looking for talented individuals 
              who are passionate about our mission. Send us your resume and we'll keep you in mind for 
              future opportunities.
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
              Send your resume
            </button>
          </motion.div>
        </motion.div>
      </div>
    </MobileAppLayout>
  );
};

export default Careers;
