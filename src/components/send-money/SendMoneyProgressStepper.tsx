
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from '@/hooks/use-mobile';
import { SendMoneyStep } from '@/hooks/useSendMoneySteps';

// Define stepper steps with enhanced naming
const steps = [
  { id: 'recipient', label: 'Recipient' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirmation', label: 'Review' },
  { id: 'complete', label: 'Complete' },
];

interface SendMoneyProgressStepperProps {
  currentStep: SendMoneyStep;
  progressPercentage: number;
}

const SendMoneyProgressStepper: React.FC<SendMoneyProgressStepperProps> = ({
  currentStep,
  progressPercentage
}) => {
  const isMobile = useIsMobile();
  
  // Get current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="fixed-progress-stepper">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30"></div>
      
      <div className={`${isMobile ? 'px-4 py-3' : 'container px-4 py-4'}`}>
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step circle with enhanced styling */}
              <div className="flex flex-col items-center relative">
                <motion.div 
                  className={`rounded-full ${isMobile ? 'w-8 h-8 text-xs' : 'w-10 h-10'} flex items-center justify-center shadow-md ${
                    index < currentStepIndex 
                      ? 'bg-green-500 text-white' 
                      : index === currentStepIndex 
                        ? 'bg-gradient-to-br from-primary to-primary-700 text-white font-bold ring-4 ring-primary/20' 
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    transition: { delay: 0.1 * index }
                  }}
                >
                  {index < currentStepIndex ? (
                    <Check className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                <motion.span 
                  className={`${isMobile ? 'text-xs mt-1' : 'text-xs mt-2'} ${
                    index === currentStepIndex ? 'font-bold text-primary-700' : 'font-medium text-gray-600'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: { delay: 0.1 * index + 0.2 }
                  }}
                >
                  {step.label}
                </motion.span>
              </div>
              
              {/* Connector line with animation */}
              {index < steps.length - 1 && (
                <div className={`flex-1 ${isMobile ? 'mx-1' : 'mx-2'} h-px bg-gray-200 relative`}>
                  <motion.div 
                    className={`absolute inset-0 ${index < currentStepIndex ? 'bg-green-500' : 'bg-primary'}`}
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: index < currentStepIndex ? "100%" : index === currentStepIndex ? `${progressPercentage}%` : "0%",
                      transition: { 
                        duration: index < currentStepIndex ? 0.5 : 0.8, 
                        ease: "easeInOut",
                        delay: index < currentStepIndex ? 0.3 + (0.1 * index) : 0
                      }
                    }}
                  ></motion.div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* New animated progress bar that shows overall completion */}
        <div className="w-full mt-2">
          <Progress value={progressPercentage} className="h-1.5 bg-gray-100">
            <motion.div 
              className="h-full bg-gradient-to-r from-green-400 via-primary to-primary-600"
              style={{ width: `${progressPercentage}%` }}
              animate={{ 
                width: `${progressPercentage}%`,
                transition: { 
                  duration: 0.8, 
                  ease: "easeInOut"
                }
              }}
            />
          </Progress>
        </div>
      </div>
    </div>
  );
};

export default SendMoneyProgressStepper;
