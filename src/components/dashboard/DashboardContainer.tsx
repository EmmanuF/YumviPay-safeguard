
import React from 'react';
import { motion } from 'framer-motion';

interface DashboardContainerProps {
  children: React.ReactNode;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => {
  // Enhanced fade in animation for sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.15,
      },
    },
  };
  
  return (
    <div className="px-4 py-3 flex-1 bg-gradient-to-b from-white to-primary-50/30">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto"
      >
        {children}
      </motion.div>
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[50%] bg-primary-100/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[40%] bg-secondary-100/20 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default DashboardContainer;
