
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import HeaderRight from './HeaderRight';
import LocaleSwitcher from './LocaleSwitcher';
import { useLocale } from '@/contexts/LocaleContext';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightElement?: React.ReactNode;
  rightContent?: React.ReactNode; // Added to support both naming conventions
  transparent?: boolean;
  showNotification?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  rightElement,
  rightContent, // Added to support both naming conventions
  transparent = false,
  showNotification = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocale();
  
  // Always define these variables, don't use early returns
  const isSendMoneyPage = location.pathname.includes('/send');
  const zIndexClass = isSendMoneyPage ? 'z-30' : 'z-50';
  const displayTitle = title ? (title.includes('.') ? t(title) : title) : t('app.name');

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  // Use either rightElement or rightContent, prioritizing rightElement if both are provided
  const rightComponent = rightElement || rightContent;

  return (
    <header className={`sticky top-0 ${zIndexClass} ${transparent ? 'bg-transparent' : 'bg-white/10 backdrop-blur-md border-b border-white/20 shadow-sm'}`}>
      <div className="px-4 py-3 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="mr-3 rounded-full p-1.5 hover:bg-white/10 transition-colors"
              aria-label={t('actions.back')}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-white">
            {displayTitle}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {showNotification && <LocaleSwitcher />}
          {rightComponent || <HeaderRight showNotification={showNotification} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
