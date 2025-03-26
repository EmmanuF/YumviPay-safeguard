import React from 'react';
import { motion } from 'framer-motion';
const HeroDescription: React.FC = () => {
  return <motion.p initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1]
  }} className="text-lg text-gray-600 mb-8 max-w-lg">
  </motion.p>;
};
export default HeroDescription;