
import React from 'react';
import { motion } from 'framer-motion';
import HeroFeatureBadges from './HeroFeatureBadges';
import HeroTitle from './HeroTitle';
import HeroDescription from './HeroDescription';
import HeroActions from './HeroActions';
import HeroFeatureBullets from './HeroFeatureBullets';
import HeroTrustIndicators from './HeroTrustIndicators';

interface HeroContentProps {
  onGetStarted: () => void;
  onSendMoney?: () => void;
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

const HeroContent: React.FC<HeroContentProps> = ({ onGetStarted, onSendMoney }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col"
    >
      <HeroFeatureBadges />
      <HeroTitle />
      <HeroDescription />
      <HeroActions onGetStarted={onGetStarted} onSendMoney={onSendMoney} />
      <HeroFeatureBullets />
      <HeroTrustIndicators />
    </motion.div>
  );
};

export default HeroContent;
