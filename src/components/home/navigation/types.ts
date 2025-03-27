
import { ReactNode } from 'react';

export interface NavItem {
  name: string;
  icon: ReactNode;
  path: string;
}

export interface NavigationProps {
  onGetStarted?: () => void;
}
