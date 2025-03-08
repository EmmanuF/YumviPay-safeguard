
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
        <button
          onClick={() => navigate('/send')}
          className="glass-effect rounded-xl p-4 flex-1 mr-2 flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-2">
            <Mail className="w-5 h-5 text-primary-500" />
          </div>
          <span className="text-sm">New Transfer</span>
        </button>
        
        <button
          onClick={() => navigate('/history')}
          className="glass-effect rounded-xl p-4 flex-1 ml-2 flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-secondary-500" />
          </div>
          <span className="text-sm">History</span>
        </button>
      </div>
    </motion.div>
  );
};

export default QuickLinks;
