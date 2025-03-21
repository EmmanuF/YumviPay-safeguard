
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface HeroActionsProps {
  onGetStarted: () => void;
}

const HeroActions: React.FC<HeroActionsProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const handleSendMoney = () => {
    console.log('Send money button clicked');
    navigate('/send');
  };

  return (
    <motion.div 
      className="flex flex-wrap gap-4 mt-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Button 
        onClick={onGetStarted}
        className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 px-6 py-6 rounded-xl text-base"
        size="lg"
      >
        Get Started
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      
      <Button 
        onClick={handleSendMoney}
        variant="secondary"
        className="bg-secondary-500 text-white hover:bg-secondary-600 shadow-lg shadow-secondary-500/20 px-6 py-6 rounded-xl text-base"
        size="lg"
      >
        Send Money
        <Send className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  );
};

export default HeroActions;
