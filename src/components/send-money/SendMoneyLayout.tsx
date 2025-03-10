
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
      case 'amount': return 'Enter Amount';
      case 'recipient': return 'Add Recipient';
      case 'payment': return 'Payment Method';
      case 'confirmation': return 'Confirm Transfer';
      default: return title;
    }
  })();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title={stepTitle} showBackButton={true} />
      <div className="flex-1 p-4">
        {stepCount && currentStep && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Step {
                  currentStep === 'amount' ? '1' :
                  currentStep === 'recipient' ? '2' :
                  currentStep === 'payment' ? '3' : '4'
                } of {stepCount}
              </span>
              <span className="text-sm font-medium">
                {
                  currentStep === 'amount' ? '25%' :
                  currentStep === 'recipient' ? '50%' :
                  currentStep === 'payment' ? '75%' : '100%'
                }
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: 
                    currentStep === 'amount' ? '25%' :
                    currentStep === 'recipient' ? '50%' :
                    currentStep === 'payment' ? '75%' : '100%'
                }}
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
