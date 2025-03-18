
import React from 'react';
import { motion } from 'framer-motion';

const FAQHeader: React.FC = () => {
  return (
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
  );
};

export default FAQHeader;
