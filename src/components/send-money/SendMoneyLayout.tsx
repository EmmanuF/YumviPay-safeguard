
import React, { ReactNode } from 'react';
import Header from '@/components/Header';

interface SendMoneyLayoutProps {
  title?: string;
  children: ReactNode;
  currentStep?: string;
  stepCount?: number;
}

const SendMoneyLayout: React.FC<SendMoneyLayoutProps> = ({ 
  title = "Send Money", 
  children,
  currentStep, 
  stepCount 
}) => {
  // Create a title based on the current step if needed
  const stepTitle = (() => {
    if (!currentStep) return title;
    
    switch(currentStep) {
      case 'recipient': return 'Add Recipient';
      case 'payment': return 'Payment Method';
      case 'confirmation': return 'Confirm Transfer';
      default: return title;
    }
  })();
  
  // Calculate step number and percentage based on current step
  const getStepInfo = () => {
    if (!currentStep) return { number: 0, percent: '0%' };
    
    switch(currentStep) {
      case 'recipient': return { number: 1, percent: '33%' };
      case 'payment': return { number: 2, percent: '66%' };
      case 'confirmation': return { number: 3, percent: '100%' };
      default: return { number: 0, percent: '0%' };
    }
  };
  
  const stepInfo = getStepInfo();
  
  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="flex-1 p-4">
        {stepCount && currentStep && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Step {stepInfo.number} of {stepCount}
              </span>
              <span className="text-sm font-medium">
                {stepInfo.percent}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: stepInfo.percent }}
              ></div>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default SendMoneyLayout;
