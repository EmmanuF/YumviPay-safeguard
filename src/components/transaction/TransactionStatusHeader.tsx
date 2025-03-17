
import React from 'react';
import Header from '@/components/Header';
import HeaderRight from '@/components/HeaderRight';

const TransactionStatusHeader = () => {
  return (
    <Header 
      title="Transaction Receipt" 
      showBackButton={true} 
      rightContent={<HeaderRight showNotification />} 
    />
  );
};

export default TransactionStatusHeader;
