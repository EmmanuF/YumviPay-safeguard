
import React, { ReactNode } from 'react';
import Header from '@/components/Header';

interface SendMoneyLayoutProps {
  title: string;
  children: ReactNode;
}

const SendMoneyLayout: React.FC<SendMoneyLayoutProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title={title} showBackButton={true} />
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default SendMoneyLayout;
