
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileHeaderProps {
  name: string;
  email: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email }) => {
  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center pb-2">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 mr-4">
          <User size={32} />
        </div>
        <div>
          <CardTitle className="text-xl">{name}</CardTitle>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProfileHeader;
