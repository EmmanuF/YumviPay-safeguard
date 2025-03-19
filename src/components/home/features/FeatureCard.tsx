
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-white/90 to-gray-300/50 border border-navy-200/50 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="w-12 h-12 rounded-full bg-primary-200 flex items-center justify-center mb-4 text-navy-600 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-black">{title}</h3>
      <p className="text-charcoal-500/80 font-medium">{description}</p>
    </div>
  );
};

export default FeatureCard;
