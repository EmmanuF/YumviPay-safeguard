import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import HeaderRight from './HeaderRight';

// Add LocaleSwitcher import
import LocaleSwitcher from './LocaleSwitcher';
import { useLocale } from '@/contexts/LocaleContext';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightElement?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  rightElement,
}) => {
  const navigate = useNavigate();
  const { t } = useLocale();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="mr-3 rounded-full p-1 hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-800">{title && t(title) || t('app.name')}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <LocaleSwitcher />
          {rightElement || <HeaderRight />}
        </div>
      </div>
    </header>
  );
};

export default Header;
