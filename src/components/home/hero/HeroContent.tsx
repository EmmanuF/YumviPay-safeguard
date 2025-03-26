
import React from 'react';
import { motion } from 'framer-motion';
import HeroTitle from './HeroTitle';
import HeroDescription from './HeroDescription';

interface HeroContentProps {
  onGetStarted: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const HeroContent: React.FC<HeroContentProps> = ({ onGetStarted }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col"
    >
      <div className="mb-6">
        <HeroTitle onGetStarted={onGetStarted} />
      </div>
      <HeroDescription />
    </motion.div>
  );
};

export default HeroContent;
