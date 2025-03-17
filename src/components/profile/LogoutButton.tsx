
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <Button 
      variant="outline" 
      className="w-full mt-4 border-destructive text-destructive hover:bg-destructive/10"
      onClick={onLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
