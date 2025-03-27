
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <motion.div 
      className="glass-effect rounded-2xl p-6 h-full"
      whileHover={{ 
        y: -5,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4 shadow-sm">
        <div className="text-primary-600">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gradient-primary">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
