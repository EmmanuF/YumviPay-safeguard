
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-white/90 to-primary-50/40 border border-primary-100/40 shadow-lg">
      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4 text-primary-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-slate-500">{title}</h3>
      <p className="text-slate-500/80">{description}</p>
    </div>
  );
};

export default FeatureCard;
