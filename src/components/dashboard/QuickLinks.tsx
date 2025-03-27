
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SendHorizonal, Clock, History, Users } from 'lucide-react';

interface QuickLinksProps {
  itemVariants: any;
}

const QuickLinks: React.FC<QuickLinksProps> = ({ itemVariants }) => {
  const navigate = useNavigate();
  
  const links = [
    {
      id: 'send',
      icon: SendHorizonal,
      label: 'New Transfer',
      path: '/send',
      colorClass: 'bg-primary-100',
      iconClass: 'text-primary-600',
      hoverClass: 'hover:shadow-primary-200/50',
      animProps: {
        hover: { y: -5, boxShadow: "0 15px 30px -8px rgba(0, 128, 0, 0.2)" }
      }
    },
    {
      id: 'history',
      icon: History,
      label: 'History',
      path: '/history',
      colorClass: 'bg-secondary-100',
      iconClass: 'text-secondary-600',
      hoverClass: 'hover:shadow-secondary-200/50',
      animProps: {
        hover: { y: -5, boxShadow: "0 15px 30px -8px rgba(138, 43, 226, 0.2)" }
      }
    },
    {
      id: 'recipients',
      icon: Users,
      label: 'Recipients',
      path: '/recipients',
      colorClass: 'bg-indigo-100',
      iconClass: 'text-indigo-600',
      hoverClass: 'hover:shadow-indigo-200/50',
      animProps: {
        hover: { y: -5, boxShadow: "0 15px 30px -8px rgba(75, 0, 130, 0.2)" }
      }
    }
  ];
  
  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-3">
        {links.map(link => (
          <motion.button
            key={link.id}
            onClick={() => navigate(link.path)}
            className={`glass-effect rounded-xl py-4 px-2 flex flex-col items-center ${link.hoverClass} transition-shadow`}
            whileHover={link.animProps.hover}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className={`w-12 h-12 rounded-full ${link.colorClass} flex items-center justify-center mb-2`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <link.icon className={`w-5 h-5 ${link.iconClass}`} />
            </motion.div>
            <span className="text-sm font-medium">{link.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
