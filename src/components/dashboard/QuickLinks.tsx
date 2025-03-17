
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Clock } from 'lucide-react';

interface QuickLinksProps {
  itemVariants: any;
}

const QuickLinks: React.FC<QuickLinksProps> = ({ itemVariants }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div variants={itemVariants} className="mb-6">
      <div className="flex justify-between">
        <motion.button
          onClick={() => navigate('/send')}
          className="glass-effect rounded-xl p-4 flex-1 mr-2 flex flex-col items-center"
          whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(91, 60, 196, 0.2)" }}
          whileTap={{ y: 0, boxShadow: "0 5px 10px -3px rgba(91, 60, 196, 0.15)" }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5 text-primary-500" />
          </motion.div>
          <span className="text-sm font-medium">New Transfer</span>
        </motion.button>
        
        <motion.button
          onClick={() => navigate('/history')}
          className="glass-effect rounded-xl p-4 flex-1 ml-2 flex flex-col items-center"
          whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(76, 212, 169, 0.2)" }}
          whileTap={{ y: 0, boxShadow: "0 5px 10px -3px rgba(76, 212, 169, 0.15)" }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mb-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Clock className="w-5 h-5 text-secondary-500" />
          </motion.div>
          <span className="text-sm font-medium">History</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuickLinks;
