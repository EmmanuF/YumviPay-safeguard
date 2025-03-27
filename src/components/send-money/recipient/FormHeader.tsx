
import React from 'react';
import { motion } from 'framer-motion';

interface FormHeaderProps {
  title: string;
  subtitle: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => {
  return (
    <>
      <motion.h2 
        className="text-2xl font-bold text-center text-primary-500 mb-3"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      >
        {title}
      </motion.h2>
      <motion.p 
        className="text-center text-gray-700 mb-8 max-w-md mx-auto"
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
      >
        {subtitle}
      </motion.p>
    </>
  );
};

export default FormHeader;
