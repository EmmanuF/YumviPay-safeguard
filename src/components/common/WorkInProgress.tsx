
import React from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import Header from '@/components/Header';

interface WorkInProgressProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  showBackButton?: boolean;
}

const WorkInProgress: React.FC<WorkInProgressProps> = ({
  title,
  description = "We're working hard to bring you this page soon. Please check back later.",
  icon,
  showBackButton = true
}) => {
  const navigate = useNavigate();
  const { t } = useLocale();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header title={title} showBackButton={showBackButton} transparent={false} />
      
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="mb-8 bg-indigo-100 p-6 rounded-full inline-block">
            {icon || (
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full">
                  <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                </div>
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-indigo-900 mb-4">{title}</h1>
          
          <p className="text-gray-600 mb-8">{description}</p>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="gap-2"
            >
              <Home size={18} />
              {t('nav.home')}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkInProgress;
