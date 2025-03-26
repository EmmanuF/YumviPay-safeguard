
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '@/contexts/LocaleContext';

interface SendMoneyLayoutProps {
  title?: string;
  children: ReactNode;
  currentStep?: number | string;
  stepCount?: number;
  onBack?: () => void;
}

const SendMoneyLayout: React.FC<SendMoneyLayoutProps> = ({ 
  title = "Send Money", 
  children,
  currentStep, 
  stepCount = 3,
  onBack
}) => {
  const navigate = useNavigate();
  const { t } = useLocale();
  
  // Create a title based on the current step if needed
  const stepTitle = (() => {
    if (!currentStep) return title;
    
    if (typeof currentStep === 'string') {
      switch(currentStep) {
        case 'recipient': return t('transaction.select_recipient');
        case 'payment': return t('transaction.payment_method');
        case 'confirmation': return t('transaction.confirm_details');
        default: return title;
      }
    }
    
    return title;
  })();
  
  // Calculate step number and percentage based on current step
  const getStepInfo = () => {
    if (!currentStep) return { number: 0, percent: '0%', icon: '📝' };
    
    if (typeof currentStep === 'string') {
      switch(currentStep) {
        case 'recipient': return { number: 1, percent: '33%', icon: '👤' };
        case 'payment': return { number: 2, percent: '66%', icon: '💳' };
        case 'confirmation': return { number: 3, percent: '100%', icon: '✅' };
        default: return { number: 0, percent: '0%', icon: '📝' };
      }
    }
    
    // If it's a number, use it directly
    return { 
      number: currentStep as number, 
      percent: `${Math.min(100, Math.round((currentStep as number / stepCount) * 100))}%`,
      icon: currentStep === 1 ? '👤' : currentStep === 2 ? '💳' : '✅'
    };
  };
  
  const stepInfo = getStepInfo();

  const handleBackNavigation = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };
  
  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const stepVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-900 via-primary-800 to-primary-700"
    >
      {/* Header with back button and title */}
      <div className="px-4 py-5 flex items-center">
        <button 
          onClick={handleBackNavigation} 
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4 text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-white">{stepTitle}</h1>
      </div>
      
      {/* Step progress indicator */}
      {currentStep && (
        <motion.div
          variants={stepVariants}
          className="px-6 pb-6"
        >
          <div className="flex justify-between mb-2">
            <div className="text-white/80 text-sm">
              {t('transaction.step')} {stepInfo.number} {t('transaction.of')} {stepCount}
            </div>
            <div className="text-white font-medium text-sm">
              {stepInfo.percent}
            </div>
          </div>
          
          {/* Step circles with icons */}
          <div className="flex justify-between mb-3">
            {[1, 2, 3].map((step) => (
              <div 
                key={step} 
                className="flex flex-col items-center"
              >
                <div 
                  className={`step-circle ${
                    step < stepInfo.number 
                      ? 'completed' 
                      : step === stepInfo.number 
                        ? 'active' 
                        : 'inactive'
                  }`}
                >
                  {step < stepInfo.number ? (
                    <Check size={18} />
                  ) : (
                    step
                  )}
                </div>
                <span className="text-xs text-white/80 mt-1">
                  {step === 1 
                    ? '👤 ' + t('transaction.recipient')
                    : step === 2 
                      ? '💳 ' + t('transaction.payment')
                      : '✅ ' + t('transaction.confirm')
                  }
                </span>
              </div>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: stepInfo.percent }}
            ></div>
          </div>
        </motion.div>
      )}
      
      {/* Content area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gray-50 rounded-t-3xl overflow-hidden">
          <div className="h-full overflow-y-auto pb-20">
            <div className="p-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SendMoneyLayout;
