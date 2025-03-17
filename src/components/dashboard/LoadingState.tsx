
import React from 'react';
import { motion } from 'framer-motion';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse-subtle">Loading...</div>
    </div>
  );
};

export default LoadingState;
