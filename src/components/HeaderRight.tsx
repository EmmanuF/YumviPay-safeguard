
import React from 'react';
import NotificationBell from './notifications/NotificationBell';

interface HeaderRightProps {
  showNotification?: boolean;
}

const HeaderRight: React.FC<HeaderRightProps> = ({ showNotification = false }) => {
  if (!showNotification) {
    return null;
  }
  
  return <NotificationBell />;
};

export default HeaderRight;
