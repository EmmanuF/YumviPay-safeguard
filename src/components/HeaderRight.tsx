
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { SignOutButton } from '@/components/authentication';

interface HeaderRightProps {
  showNotification?: boolean;
}

const HeaderRight: React.FC<HeaderRightProps> = ({ showNotification = false }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  return (
    <div className="flex items-center space-x-3">
      {showNotification && (
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-1.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-white" />
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
            3
          </Badge>
        </button>
      )}
      
      {/* Always show sign out button when user is logged in */}
      {isLoggedIn && (
        <SignOutButton 
          size="sm" 
          iconOnly 
          className="!bg-white/10 !text-white hover:!bg-white/20 border-none" 
        />
      )}
    </div>
  );
};

export default HeaderRight;
