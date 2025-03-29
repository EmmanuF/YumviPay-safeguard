
import React from 'react';
import { User } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/auth';

const PersonalizedWelcome: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLocale();
  
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  const showWelcome = displayName.length > 0;
  
  if (!showWelcome) return null;
  
  return (
    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-3 mx-auto">
      <User className="w-4 h-4 mr-2 text-primary-300" />
      <span>
        {t('home.welcomeBack')}, {displayName}
      </span>
    </div>
  );
};

export default PersonalizedWelcome;
