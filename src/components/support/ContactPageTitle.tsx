
import React from 'react';
import { motion } from 'framer-motion';

const ContactPageTitle: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-primary-800 mb-2">
        Contact Us
      </h1>
      <p className="text-gray-600">
        Have questions or need assistance? We're here to help!
      </p>
    </motion.div>
  );
};

export default ContactPageTitle;
